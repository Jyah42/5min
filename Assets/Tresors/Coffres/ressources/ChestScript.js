#pragma strict

var particules : ParticleSystem;
var collision = false;

var treasure1 : GameObject;
var treasure2 : GameObject;
var treasure3 : GameObject;
var treasureSize : int = 1;

function Start () 
{

}

function Update () 
{

}


function Boom() {
if (!collision) {
	particules.Play();
	collision = true;
	Invoke("dropTreasure", 0.25);
	Destroy(gameObject.transform.parent.gameObject, 0.75);
	}
}

function dropTreasure()
{
	var nbTreasure = 0;
	for (var i = 0; i < 3 * treasureSize; i++)
	{
		nbTreasure += Random.Range(0, 2);
	}
	for (var j = 0; j < 1 * treasureSize; j++)
	{
		nbTreasure += Random.Range(3, 5);
	}
	var pos = transform.position;
	while (nbTreasure >= 15)
	{
		nbTreasure -= 15;
		pos = transform.position;
		pos += transform.forward * Random.Range(-0.5, 0.5);
		Instantiate(treasure3, pos, Quaternion.identity);
	}
	while (nbTreasure >= 5)
	{
		nbTreasure -= 5;
		pos = transform.position;
		pos += transform.forward * Random.Range(-0.5, 0.5);
		Instantiate(treasure2, pos, Quaternion.identity);
	}
	while (nbTreasure >= 1)
	{
		nbTreasure -= 1;
		pos = transform.position;
		pos += transform.forward * Random.Range(-0.5, 0.5);
		Instantiate(treasure1, pos, Quaternion.identity);
	}
}