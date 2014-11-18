#pragma strict

var treasure1 : GameObject;
var treasure2 : GameObject;
var treasure3 : GameObject;

private var target : GameObject;
private var speed : int = 3;
private var rSpeed : int = 7;
private var detectRange : int = 15;
private var lifeMax : int = 15;
private var life : int = 30;
private var atkRange : int = 10;
private var levitationMax : float = 0.2;
private var levitationMin : float = -0.2;
private var bonus_damage: boolean = false;
var bumped : int = 0;

enum SentinelleBaseState
{
	Waiting,
	Chasing,
	Dead
}

private var state : SentinelleBaseState = SentinelleBaseState.Waiting;
private var lastState : SentinelleBaseState = SentinelleBaseState.Waiting;
private var timer : float = 0;
private var timerHurt : float = 0;


function Start () 
{
	target = GameObject.FindWithTag("Player");
	life = lifeMax;
	state = SentinelleBaseState.Waiting;
	lastState = SentinelleBaseState.Waiting;
}

function Update ()
{
	var dist = Vector3.Distance(target.transform.position, transform.position);
	var rotate = Quaternion.LookRotation(target.transform.position - transform.position);
	timer += Time.deltaTime;
	timerHurt += Time.deltaTime;
	
	if (bumped > 0)
		{
			transform.position += transform.forward * -1 * bumped;
			bumped = 0;
		}
	
	switch (state)
	{
		case SentinelleBaseState.Waiting:
			if (dist <= detectRange)
				stateChange(SentinelleBaseState.Chasing);
		break;
		
		case SentinelleBaseState.Chasing:
			transform.rotation = Quaternion.Slerp(transform.rotation, rotate, Time.deltaTime * rSpeed);
			if (dist < atkRange)
				transform.position += transform.forward * speed * Time.deltaTime * -1;
			else
				transform.position += transform.forward * speed * Time.deltaTime;
			if (dist > detectRange)
				stateChange(SentinelleBaseState.Waiting);
			if (transform.position.y > levitationMax)
				transform.position.y = levitationMax;
			else if (transform.position.y < levitationMin)
				transform.position.y = levitationMin;
				
		break;
		
		case SentinelleBaseState.Dead:
		if (transform.position.y > -1.5)
			transform.position += transform.up * 20 * Time.deltaTime * -1;
		break;
	}
}

function stateChange(newState : SentinelleBaseState)
{
	timer = 0;
	state = newState;
	switch (state)
	{
		case SentinelleBaseState.Dead:
			Invoke("dropTreasure", 1);
			Destroy(gameObject, 2);
		break;
	}
}

function dropTreasure()
{
	var nbTreasure = 0;
	for (var i = 0; i < 3; i++)
	{
		nbTreasure += Random.Range(0, 3);
	}
	nbTreasure += Random.Range(3, 9);
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

function OnTriggerEnter(other : Collider)
{  
  	if (state != SentinelleBaseState.Dead && timerHurt > 1)
 	{
	    if(other.name == "PlayerSwordCollider")
	    {
	   		timerHurt = 0;
	   		if (bonus_damage) {
	   			life -=20; 
	   		} else {
	     		life -= 10;
	     	}
	     	if (life <= 0 )
				stateChange(SentinelleBaseState.Dead);
		}
		if(other.name == "PlayerShield")
	    {
	    	timerHurt = 0;
	   		if (bonus_damage) {
	     		life -= 2;
	     	} else {
	     		life -= 1;
	     	}
	     if (life <= 0 )
			stateChange(SentinelleBaseState.Dead);
		}
	}
}

function SetBonusDamageEnabled() {
	bonus_damage = true;
}

function SetBonusDamageDisabled() {
	bonus_damage = false;
}