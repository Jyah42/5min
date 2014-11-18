#pragma strict

var skeleton :GameObject;
var sword	:	GameObject;
var treasure1 : GameObject;
var treasure2 : GameObject;
var treasure3 : GameObject;
var atkSound	:AudioClip;
var gethitSound	:AudioClip;
var deathSound	:AudioClip;

private var target : GameObject;
private var speed : int = 4;
private var rSpeed : int = 5;
private var detectRange : int = 10;
private var detectRange2 : int = 15;
private var lifeMax : int = 15;
private var life : int = 25;
private var atkRange : int = 2;
private var atkSpeed : float = 1.75;
private var searchingTime : float = 5;
private var bonus_damage: boolean = false;

enum SkeletonState
{
	Waiting,
	Searching,
	Chasing,
	Attacking,
	Hurted,
	Stuned,
	Dead
}

private var state : SkeletonState = SkeletonState.Waiting;
private var lastState : SkeletonState = SkeletonState.Waiting;
private var timer : float = 0;
private var timerHurt : float = 0;


function Start () 
{
	target = GameObject.FindWithTag("Player");
	life = lifeMax;
	state = SkeletonState.Waiting;
	lastState = SkeletonState.Waiting;
	timerHurt = Time.time;
	skeleton.animation["gethit"].speed = 2;
}

function Update ()
{
	var dist = Vector3.Distance(target.transform.position, transform.position);
	var rotate = Quaternion.LookRotation(target.transform.position - transform.position);
	timer += Time.deltaTime;
	
	switch (state)
	{
		case SkeletonState.Waiting:
			skeleton.animation.CrossFade("idle");
			if (dist <= detectRange)
				stateChange(SkeletonState.Chasing);
		break;
		
		case SkeletonState.Searching:
			skeleton.animation.CrossFade("waitingforbattle");
			if (dist <= detectRange2)
				stateChange(SkeletonState.Chasing);
			else if (timer > searchingTime)
				stateChange(SkeletonState.Waiting);
		break;
		
		
		case SkeletonState.Chasing:
		
			transform.rotation = Quaternion.Slerp(transform.rotation, rotate, Time.deltaTime * 3);	
			transform.position += transform.forward * speed * Time.deltaTime;
			skeleton.animation.CrossFade("run");
			
			if (dist > detectRange2)
				stateChange(SkeletonState.Searching);
			else if (dist <= atkRange)
				stateChange(SkeletonState.Attacking);		
		break;
		
		case SkeletonState.Attacking:
			transform.rotation = Quaternion.Slerp(transform.rotation, rotate, Time.deltaTime * 3);
			if (dist <= atkRange)
			{
				if (timer > atkSpeed)
				{
					audio.PlayOneShot(atkSound);
					skeleton.animation.CrossFade("attack");
					Invoke("activeSword", 0.2);
					Invoke("disableSword", 0.8);
					timer = 0;
				}
				else
				{
					if (timer > 1)
					skeleton.animation.CrossFade("waitingforbattle");
				}
			}
			else
			{
				stateChange(SkeletonState.Chasing);
			}
		break;
		
		case SkeletonState.Hurted:
			if (life < 0)
				stateChange(SkeletonState.Dead);
			else if (timer > 1)
			{
				stateChange(lastState);
			}
		break;
		
		case SkeletonState.Stuned:
			if (timer < 0.3)
			{
				transform.rotation = Quaternion.Slerp(transform.rotation, rotate, 1);
				transform.position += transform.forward * -45 * (0.3 - timer) * Time.deltaTime;
			}
			if (life < 0)
				stateChange(SkeletonState.Dead);
			else if (timer > 3)
			{
				stateChange(lastState);
			}
		break;
		
		case SkeletonState.Dead:
			
		break;
	}
}

function stateChange(newState : SkeletonState)
{
	timer = 0;
	if (state != SkeletonState.Hurted && state != SkeletonState.Stuned)
		lastState = state;
	state = newState;
	switch (state)
	{
		case SkeletonState.Hurted:
			skeleton.animation.CrossFade("gethit");
		break;
		
		case SkeletonState.Stuned:
			skeleton.animation.CrossFade("idle");
		break;
		
		case SkeletonState.Attacking:
			timer = atkSpeed;
		break;
	
		case SkeletonState.Dead:
			audio.PlayOneShot(deathSound);
			skeleton.animation.CrossFade("die");
			Invoke("dropTreasure", 1);
			Destroy(gameObject, 2.5);
		break;
	}
}

function dropTreasure()
{
	var nbTreasure = 0;
	for (var i = 0; i < 3; i++)
	{
		nbTreasure += Random.Range(0, 1);
	}
	nbTreasure += Random.Range(1, 4);
	var pos = transform.position;
	while (nbTreasure >= 15)
	{
		nbTreasure -= 15;
		pos = transform.position;
		pos.x += Random.Range(-1, 1);
		pos.z += Random.Range(-1, 1);
		Instantiate(treasure3, pos, Quaternion.identity);
	}
	while (nbTreasure >= 5)
	{
		nbTreasure -= 5;
		pos = transform.position;
		pos.x += Random.Range(-1, 1);
		pos.z += Random.Range(-1, 1);
		Instantiate(treasure2, pos, Quaternion.identity);
	}
	while (nbTreasure >= 1)
	{
		nbTreasure -= 1;
		pos = transform.position;
		pos.x += Random.Range(-1, 1);
		pos.z += Random.Range(-1, 1);
		Instantiate(treasure1, pos, Quaternion.identity);
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

function OnTriggerEnter(other : Collider)
{
  	if (state != SkeletonState.Dead && Time.time - timerHurt > 1)
 	{
	    if(other.name == "PlayerSwordCollider")
	    {
	   		audio.PlayOneShot(gethitSound);
	   		timerHurt = Time.time;
	   		if (bonus_damage) {
	     		life -= 20;
	     	} else {
	     		life -= 10;
	     	}
	     	if (state != SkeletonState.Stuned)
				stateChange(SkeletonState.Hurted);
		}
		if(other.name == "PlayerShield")
	    {
	    	audio.PlayOneShot(gethitSound);
	   		timerHurt = Time.time;
	   		if (bonus_damage) {
	     		life -= 2;
	     	} else {
	     		life -= 1;
	     	}
	     	stateChange(SkeletonState.Stuned);
		}
	}
}

function SetBonusDamageEnabled() {
	bonus_damage = true;
}

function SetBonusDamageDisabled() {
	bonus_damage = false;
}