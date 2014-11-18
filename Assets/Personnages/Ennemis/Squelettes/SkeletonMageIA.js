#pragma strict

var skeleton :GameObject;
var sword	:	GameObject;
var castPoint : GameObject;
var fireBall : Transform;
var treasure1 : GameObject;
var treasure2 : GameObject;
var treasure3 : GameObject;
var atkSound	:AudioClip;
var gethitSound	:AudioClip;
var deathSound	:AudioClip;

private var target : GameObject;
private var speed : int = 4;
private var rSpeed : int = 5;
private var detectRange : int = 20;
private var detectRange2 : int = 10;
private var lifeMax : int = 15;
private var life : int = 9;
private var atkRange : int = 2;
private var atkSpeed : float = 2;
private var castSpeed : float = 3;
private var shotPower = 750;
private var bonus_damage: boolean = false;

enum SkeletonMageState
{
	Waiting,
	Chasing,
	Attacking,
	Hurted,
	Stuned,
	Dead
}

private var state : SkeletonMageState = SkeletonMageState.Waiting;
private var lastState : SkeletonMageState = SkeletonMageState.Waiting;
private var timer : float = 0;
private var timerHurt : float = 0;


function Start () 
{
	target = GameObject.FindWithTag("Player");
	life = lifeMax;
	state = SkeletonMageState.Waiting;
	lastState = SkeletonMageState.Waiting;
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
		case SkeletonMageState.Waiting:
			skeleton.animation.CrossFade("idle");
			if (dist <= detectRange)
				stateChange(SkeletonMageState.Chasing);
		break;
		
		
		case SkeletonMageState.Chasing:
		
			transform.rotation = Quaternion.Slerp(transform.rotation, rotate, Time.deltaTime * 3);	
			if (dist > detectRange2)
			{
				transform.position += transform.forward * speed * Time.deltaTime;
				skeleton.animation.CrossFade("run");
			}
			else
			{
				if (timer > castSpeed)
					{	
						audio.PlayOneShot(atkSound);
						skeleton.animation.CrossFade("attack");
						fireBallCast(rotate);
						timer = 0;
					}
				else
				{
					if (timer > 1)
					skeleton.animation.CrossFade("waitingforbattle");
				}
			}
			
			if (dist > detectRange)
				stateChange(SkeletonMageState.Waiting);
			else if (dist <= atkRange)
				stateChange(SkeletonMageState.Attacking);		
		break;
		
		case SkeletonMageState.Attacking:
			transform.rotation = Quaternion.Slerp(transform.rotation, rotate, Time.deltaTime * 3);
			if (dist <= atkRange)
			{
				if (timer > atkSpeed)
				{
					audio.PlayOneShot(atkSound);
					skeleton.animation.CrossFade("attack");
					Invoke("activeSword", 0.2);
					Invoke("disableSword", 0.6);
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
				stateChange(SkeletonMageState.Chasing);
			}
		break;
		
		case SkeletonMageState.Hurted:
			if (life < 0)
				stateChange(SkeletonMageState.Dead);
			else if (timer > 3)
			{
				stateChange(lastState);
			}
		break;
		
		case SkeletonMageState.Stuned:
			if (timer < 0.3)
			{
				transform.rotation = Quaternion.Slerp(transform.rotation, rotate, 1);
				transform.position += transform.forward * -45 * (0.3 - timer) * Time.deltaTime;
			}
			if (life < 0)
				stateChange(SkeletonMageState.Dead);
			else if (timer > 1.75)
			{
				stateChange(lastState);
			}
		break;
		
		
		case SkeletonMageState.Dead:
			
		break;
	}
}

function stateChange(newState : SkeletonMageState)
{
	timer = 0;
	if (state != SkeletonMageState.Hurted && state != SkeletonMageState.Stuned)
		lastState = state;
	state = newState;
	switch (state)
	{
		case SkeletonMageState.Hurted:
			audio.PlayOneShot(gethitSound);
			skeleton.animation.CrossFade("gethit");
		break;
		
		case SkeletonMageState.Stuned:
			audio.PlayOneShot(gethitSound);
			skeleton.animation.CrossFade("idle");
		break;
		
		
		case SkeletonMageState.Attacking:
			timer = atkSpeed;
		break;
	
		case SkeletonMageState.Chasing:
			if (lastState != SkeletonMageState.Attacking)
				timer = castSpeed;
		break;
	
		case SkeletonMageState.Dead:
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
		nbTreasure += Random.Range(1, 3);
	}
	nbTreasure += Random.Range(3, 6);
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
  	if (state != SkeletonMageState.Dead && Time.time - timerHurt > 1)
 	{
	    if(other.name == "PlayerSwordCollider")
	    {
	   		timerHurt = Time.time;
	   		if (bonus_damage) {
	     		life -= 20;
	     	} else {
	     		life -= 10;
	     	}
	     	if (state != SkeletonMageState.Stuned)
				stateChange(SkeletonMageState.Hurted);
		}
		if(other.name == "PlayerShield")
	    {
	   		timerHurt = Time.time;
	   		if (bonus_damage) {
	     		life -= 2;
	     	} else {
	     		life -= 1;
	     	}
	     	stateChange(SkeletonMageState.Stuned);
		}
	}
}

function fireBallCast(rotate)
{
	Instantiate(fireBall, castPoint.transform.position, rotate);	
}

function SetBonusDamageEnabled() {
	bonus_damage = true;
}

function SetBonusDamageDisabled() {
	bonus_damage = false;
}