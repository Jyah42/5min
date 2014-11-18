#pragma strict

var player: 		GameObject;
var hud: 			GameObject;
var sang: 			Transform;
var flameBrulure: 	Transform;
var sword:			GameObject;
var shield:			GameObject;
var label_style: 	GUIStyle = GUIStyle();
var atkSound	:AudioClip;
var gethitSound	:AudioClip;
var resistSound	:AudioClip;
var deathSound	:AudioClip;
var stepSound	:AudioClip;
var potionSound	:AudioClip;
var level1_sound: AudioClip;
var level2_sound: AudioClip;
var levelboss_sound: AudioClip;

var speedMax : float = 12.0;
private var speed : float = 0;
var gravity = 20.0;
var rotationSpeed = 20.0;
private var moveDirection = Vector3.zero;
var eternityCristals: int = 0;
public var speedRecupDelay : float = 0.5;
private var lastSpeedRecup : float = 0;
private var bumped : int = 0;

enum Potion {
	NoPotion,
 	PinkPotion,
	SilverPotion,
	GoldPotion
}

// Potions stuff
var current_potion:			Potion = Potion.NoPotion;
var potion_in_use:			boolean = false;
var potion_timer:			double = 0.0;
var alive: 					boolean = true;

var level: 					int = 2;

var on_change_level:		boolean = false;
var damage_bonus:			boolean = false;
var cristals_bonus:			boolean = false;

var stepTimer :				float = 0;
var inMolten	:			boolean = false;
var hurtTimer :				float = 0;

function Start()
{
	audio.PlayOneShot(level1_sound);
	speed = speedMax;
	player.animation["attack"].speed = 1.75;
	player.animation["resist"].speed = 1.5;
	DontDestroyOnLoad(gameObject);
}
 
function OnLevelWasLoaded(lvl: int) {
	switch (lvl) {
		case 3: audio.Stop(); audio.loop = true; audio.PlayOneShot(level2_sound); transform.position.x = 5; transform.position.z = 5; break;
		case 4: audio.loop = true; hud.SendMessage("SetScoreBeforeBoss"); audio.Stop(); audio.PlayOneShot(levelboss_sound); transform.position.x = 21; transform.position.z = 49; break;
	}
} 

function FixedUpdate()
{
	if (!alive) {
		return;
	}
	var controller:CharacterController = GetComponent(CharacterController);
	
	if(inMolten && Time.time - hurtTimer > 0.5)
    {
    	audio.PlayOneShot(gethitSound);
    	Instantiate(flameBrulure, Vector3(0, 0, 0), Quaternion.identity);
    	hurtTimer = Time.time;
    	addCrystal(-2);
    }
	
	if (speed < speedMax)
	{
		lastSpeedRecup += Time.deltaTime;
		if (lastSpeedRecup >= speedRecupDelay)
		{
			speed += 1.5;
			lastSpeedRecup = 0;
			if (speed > speedMax)
				speed = speedMax;
		}
	}
	
	if (controller.isGrounded)
	{
		var newRotation=Input.GetAxis("Horizontal") * rotationSpeed;
		transform.Rotate(0, newRotation * 1.5 * Time.deltaTime,0);
		//--------------------------------------------------------------------
		moveDirection = Vector3(0, 0, Input.GetAxis("Vertical"));
		moveDirection = transform.TransformDirection(moveDirection);
		moveDirection *= speed;
		//----------------------------------------------------------------------
		if (!player.animation.IsPlaying("attack") && !player.animation.IsPlaying("resist")) {
			if (Input.GetAxis("Vertical") && controller.isGrounded)
			{
				if (Time.time - stepTimer > 0.35)
				{
					audio.PlayOneShot(stepSound);
					stepTimer = Time.time;
				}
				player.animation.Play("run");
			}
			else
			{
				player.animation.CrossFade("idle");
			}
			if (Input.GetButton("Fire1"))
			{
				audio.PlayOneShot(atkSound);
				player.animation.CrossFade("attack");
				Invoke("activeSword", 0.1);
				Invoke("disableSword", 0.4);
			}
			else if (Input.GetButton("Fire2")) {
				audio.PlayOneShot(resistSound);
				player.animation.CrossFade("resist");
				Invoke("activeShield", 0.3);
				Invoke("disableShield", 0.7);
			}
		}
	}
	if (bumped > 0)
	{
		moveDirection = Vector3(0, 0, -1);
		moveDirection = transform.TransformDirection(moveDirection);
		moveDirection *= 3 * bumped;
		if (controller.isGrounded)
			moveDirection.y = 3;
		bumped = 0;
		controller.Move(moveDirection * Time.deltaTime);
	}
	else if (!player.animation.IsPlaying("attack") && !player.animation.IsPlaying("resist")) {
		moveDirection.y -= gravity * Time.deltaTime;
		controller.Move(moveDirection * Time.deltaTime);
	}
	PotionControl();
}

function OnGUI() {
	if (on_change_level) {
		GUI.Label(Rect(Screen.width / 2 - 285, Screen.height / 2 - 100, 200, 200), "Il vous faut au moin 1 cristal", label_style);
		GUI.Label(Rect(Screen.width / 2 - 280, Screen.height / 2 - 60, 200, 200), "pour aller au niveau suivant", label_style);
		GUI.Label(Rect(Screen.width / 2 - 300, Screen.height / 2 + 20, 200, 200), "Niveau suivant ? Pressez Entrer...", label_style);
    	
    	if (Input.GetKeyDown("return")
    		&& eternityCristals >= 1) {
	    	level += 1;
	    	on_change_level = false;
	    	Application.LoadLevel(level);
    	}
	}
}

function activeSword()
{
	var swordCollider:CapsuleCollider = sword.GetComponent(CapsuleCollider);
	swordCollider.enabled = true;
}
function disableSword()
{
	var swordCollider:CapsuleCollider = sword.GetComponent(CapsuleCollider);
	swordCollider.enabled = false;
}

function activeShield()
{
	var shieldCollider:BoxCollider = shield.GetComponent(BoxCollider);
	shieldCollider.enabled = true;
}
function disableShield()
{
	var shieldCollider:BoxCollider = shield.GetComponent(BoxCollider);
	shieldCollider.enabled = false;
}



function OnTriggerEnter(other : Collider)
{  
    if(other.name == "Herse")
    {
     	other.animation.Play("OuvertureHerse");
    }
    if (other.name == "MorceauBleu" || other.name == "MorceauBleu(Clone)") { // 1
    	addCrystal(1);
    	other.SendMessage("Boom");
    }
    if (other.name == "MorceauRouge" || other.name == "MorceauRouge(Clone)") { // 15
    	addCrystal(15);
    	other.SendMessage("Boom");
    }
    if (other.name == "MorceauVert" || other.name == "MorceauVert(Clone)") { // 5
     	addCrystal(5);
    	other.SendMessage("Boom");
    }
    if(other.name == "Coffre")
    {
      	other.SendMessage("Boom");
    }
    if(other.name == "dagger")
    {
    	audio.PlayOneShot(gethitSound);
   	 	Instantiate(sang, Vector3(0, 0, 0), Quaternion.identity);
   	 	bumped = 1;
   	 	addCrystal(-1);
    }
    
    if(other.name == "PoingDroit"
    	|| other.name == "PoingGauche")
    {
    	audio.PlayOneShot(gethitSound);
   	 	Instantiate(sang, Vector3(0, 0, 0), Quaternion.identity);
   	 	bumped = 3;
   	 	addCrystal(-5);
    }
    if(other.name == "FlecheCorps")
    {
    	audio.PlayOneShot(gethitSound);
   	 	speed -= 5;
   	 	addCrystal(-1);
   	 	Instantiate(sang, Vector3(0, 0, 0), Quaternion.identity);
   	 	if (speed < speedMax / 4)
   	 		speed = speedMax / 4;
    }
    if(other.name == "Lave" || other.name == "LaveBoss" || other.name == "LaveBoss(Clone)")
    {
    	inMolten = true;
    	Instantiate(flameBrulure, Vector3(0, 0, 0), Quaternion.identity);
    	audio.PlayOneShot(gethitSound);
    	hurtTimer = Time.time;
    	addCrystal(-2);
    }
    if(other.name == "FireBallCollider")
    {
    	Instantiate(flameBrulure, Vector3(0, 0, 0), Quaternion.identity);
    	audio.PlayOneShot(gethitSound);
    	bumped = 3;
    	addCrystal(-3);
    }
    
    // handle Potions
    if (current_potion == Potion.NoPotion) {
	    if (other.name == "PotionPink") {
    		current_potion = Potion.PinkPotion;
    		hud.SendMessage("UpdateCurrentPotion", Potion.PinkPotion);
    		other.SendMessage("Boom");
	    }
	    if (other.name == "PotionGold") {
    		current_potion = Potion.GoldPotion;
    		hud.SendMessage("UpdateCurrentPotion", Potion.GoldPotion);
    		other.SendMessage("Boom");
	    }
	    if (other.name == "PotionSilver") {
    		current_potion = Potion.SilverPotion;
    		hud.SendMessage("UpdateCurrentPotion", Potion.SilverPotion);
    		other.SendMessage("Boom");
	    }
    }
    
    // Change Level
    if (other.name == "ExitPoint") {
    	on_change_level = true;
    }
    
    // Damage bonus
    if (damage_bonus) {
    	if (other.name == "SkeletonWarrior"
    		|| other.name == "SkeletonMage"
    		|| other.name == "Sentinelle") {
    		other.SendMessage("SetBonusDamageEnabled");
    	}
    }
}

function OnTriggerExit(other: Collider) {
	if (other.name == "ExitPoint") {
	   	on_change_level = false;
	}
	if (other.name == "SkeletonWarrior"
		|| other.name == "SkeletonMage"
		|| other.name == "Sentinelle") {
		other.SendMessage("SetBonusDamageDisabled");
	}
	 if(other.name == "Lave" || other.name == "LaveBoss" || other.name == "LaveBoss(Clone)")
    {
    	inMolten = false;
    }
}


function addCrystal(nb : int)
{
	if ((eternityCristals + nb) >= 0)
	{
		if (cristals_bonus == true && nb > 0) 
			nb *= 2;
		hud.SendMessage("AddEternity", nb);
		hud.SendMessage("AddEternityGS", nb);
    	eternityCristals += nb;
    }
    else
    {
    	hud.SendMessage("AddEternity", -eternityCristals);
    	hud.SendMessage("AddEternityGS", -eternityCristals);
    	eternityCristals = 0;
    }
}

function PotionControl() {
	// Drop an handled potion
	if (Input.GetButton("Jump")) {
		current_potion = Potion.NoPotion;
		audio.PlayOneShot(potionSound);
		hud.SendMessage("UpdateCurrentPotion", Potion.NoPotion);
	}
	// Use a potion
	else if (Input.GetButton("Fire3")
			&& current_potion != Potion.NoPotion) {
		audio.PlayOneShot(potionSound);
		ResetPotionBonus();
		potion_in_use = true;
		potion_timer = Time.realtimeSinceStartup;
		switch (current_potion) {
			case Potion.PinkPotion: speed = 18; break;
			case Potion.GoldPotion: damage_bonus = true; break;
			case Potion.SilverPotion: cristals_bonus = true; break;
		}
		// Update HUD
		hud.SendMessage("UsePotion", current_potion);
		current_potion = Potion.NoPotion;
		hud.SendMessage("UpdateCurrentPotion", Potion.NoPotion);
	}
	// Test if the potion effect is ended
	if (potion_in_use == true
		&& potion_timer + 15.0 <= Time.realtimeSinceStartup) {
		hud.SendMessage("UsePotion", Potion.NoPotion);
		ResetPotionBonus();
	}
}

// Call it to reset all the bonus acquired with potions
function ResetPotionBonus() {
	damage_bonus = false;
	cristals_bonus = false;
	potion_in_use = false;
	potion_timer = 0.0;
	speed = speedMax;
}

function SetDead() {
	audio.PlayOneShot(deathSound);
	player.animation.Play("diehard");
	alive = false;
}
