#pragma strict

var boss 		:GameObject;
var swordLeft	:GameObject;
var swordRight	:GameObject;
var castPoint 	:GameObject;
var lavaSpawn 	:GameObject;
var fireBall 	:Transform;
var molten 		:Transform;
var gethitSound	:AudioClip;
var roarSound	:AudioClip;
var atkSound	:AudioClip;
var moltenSpawnSound	:AudioClip;

private var target : GameObject;
private var gs_mgr : GameObject;
private var speed : int = 4;
private var rSpeed : int = 3;
private var detectRange : int = 20;
private var detectRange2 : int = 10;
private var lifeMax : int = 199;
private var life : int = lifeMax;
private var atkRange : float = 5;
private var atkSpeed : float = 2.5;
private var castSpeed : float = 3;
private var battle :boolean = false;
private var aoeTimer : float = 0;
private var atkTimer : float = 0;
private var hitTimer : float = 0;
private var timer : float = 0;
private var counter : int = 0;
private var counterLimit : int = 3;

enum bossState
{
	Waiting,
	Chasing,
	Attacking,
	Crushing,
	Hurted,
	Dead
}

private var state : bossState = bossState.Waiting;
private var lastState : bossState = bossState.Waiting;



function Start ()
{
	target = GameObject.FindWithTag("Player");
	gs_mgr = GameObject.FindWithTag("MainCamera");
	life = lifeMax;
	state = bossState.Waiting;
	lastState = bossState.Waiting;
	counterLimit = Random.Range(3,5);
}

function Update ()
{
	var dist = Vector3.Distance(target.transform.position, transform.position);
	var rotate = Quaternion.LookRotation(target.transform.position - transform.position);
	
	switch (state)
	{
		case bossState.Waiting:
			boss.animation.CrossFade("idle");
			if (dist <= detectRange)
			{
				if (!battle)
					{
						battle = true;
						timer = Time.time;
						audio.PlayOneShot(roarSound);
					}
				boss.animation.CrossFade("roar");
				
				if (Time.time - timer > 2.5)
					stateChange(bossState.Chasing);
			}
		break;
		
		case bossState.Chasing:
			transform.rotation = Quaternion.Slerp(transform.rotation, rotate, Time.deltaTime * rSpeed);
			if (counter >= counterLimit)
				stateChange(bossState.Crushing);
			if (Time.time - atkTimer > castSpeed)
				CastFireBall();
			else if (!boss.animation.IsPlaying("punch"))
				boss.animation.CrossFade("idle");
			if (dist > detectRange2 && !boss.animation.IsPlaying("punch"))
				Move();
			if (dist <= atkRange)
				stateChange(bossState.Attacking);	
		break;
		
		case bossState.Attacking:
			transform.rotation = Quaternion.Slerp(transform.rotation, rotate, Time.deltaTime * rSpeed);
			
			if (dist > 2 && !boss.animation.IsPlaying("punch"))
				Move();
			else if (Time.time - atkTimer > atkSpeed)
				Attack();
			else if (!boss.animation.IsPlaying("punch"))
				boss.animation.CrossFade("idle");
				
			if (counter >= counterLimit)
				stateChange(bossState.Crushing);
			if (dist > atkRange)
				stateChange(bossState.Chasing);
		break;
		
		case bossState.Crushing:
			transform.rotation = Quaternion.Slerp(transform.rotation, rotate, Time.deltaTime * rSpeed);
			if (!boss.animation.IsPlaying("roar") && !boss.animation.IsPlaying("high_punch"))
			{
				boss.animation.CrossFade("high_punch");

				Invoke("Crush", 0.5);
			}
			if (Time.time - aoeTimer > 4.25)
				stateChange(bossState.Chasing);
		break;
		
		case bossState.Hurted:
			if (life <= 0)
				stateChange(bossState.Dead);
			else
				stateChange(lastState);
		break;
		
		case bossState.Dead:
			
		break;
	}
}

function stateChange(newState : bossState)
{
	timer = 0;
	if (state != bossState.Hurted)
		lastState = state;
	state = newState;
	print (state);
	switch (state)
	{
		case bossState.Dead:
			gs_mgr.SendMessage("BossIsDead");
			boss.animation.CrossFade("death");
			Destroy(gameObject, 2.5);
		break;
		
		case bossState.Crushing:
			counter = 0;
			counterLimit = Random.Range(4,7);
			aoeTimer = Time.time;
			boss.animation.CrossFade("roar");
			audio.PlayOneShot(roarSound);
		break;
	}
}

function activeLeftSword()
{
	var swordLeftCollider:CapsuleCollider = swordLeft.GetComponent(CapsuleCollider);
	swordLeftCollider.enabled = true;
}

function activeRightSword()
{
	var swordRightCollider:CapsuleCollider = swordRight.GetComponent(CapsuleCollider);
	swordRightCollider.enabled = true;
}

function disableLeftSword()
{
	var swordLeftCollider:CapsuleCollider = swordLeft.GetComponent(CapsuleCollider);
	swordLeftCollider.enabled = false;
}

function disableRightSword()
{
	var swordRightCollider:CapsuleCollider = swordRight.GetComponent(CapsuleCollider);
	swordRightCollider.enabled = false;
}

function OnTriggerEnter(other : Collider)
{  
  	if (state != bossState.Dead)
 	{
	    if(other.name == "PlayerSwordCollider")
	    {
	    	audio.PlayOneShot(gethitSound);
	     	life -= 10;
			if (life <= 0)
				stateChange(bossState.Dead);
		}
	}
}


function CastFireBall()
{
	var rotate = Quaternion.LookRotation(target.transform.position - transform.position);
	audio.PlayOneShot(atkSound);
	atkTimer = Time.time;
	boss.animation.CrossFade("punch");
	Instantiate(fireBall, castPoint.transform.position, rotate);
	counter += 1;	
}


function Attack()
{
	audio.PlayOneShot(atkSound);
	boss.animation.CrossFade("punch");
	Invoke("activeRightSword", 0.2);
	Invoke("disableRightSword", 0.8);
	atkTimer = Time.time;
	counter += 1;
}

function Move()
{
	transform.position += transform.forward * speed * Time.deltaTime;
	boss.animation.CrossFade("walk");
}

function Crush()
{
	
	var rotate = Quaternion.LookRotation(target.transform.position - transform.position);
	Instantiate(fireBall, castPoint.transform.position, rotate);
	audio.PlayOneShot(moltenSpawnSound);
	Instantiate(molten, lavaSpawn.transform.position, rotate);
}