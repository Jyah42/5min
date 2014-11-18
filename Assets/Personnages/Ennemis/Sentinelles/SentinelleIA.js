#pragma strict

var bullet : Transform;
var atkSound : AudioClip;

enum SentinelleAction
{
	Fireing,
	Reloading
}

private var target : GameObject;
private var action : SentinelleAction = SentinelleAction.Reloading;
private var fireRate : float = 5; // nb shot/sec
private var capacityMax : int = 3; // capacite du chargeur
private var capacity : int = 0; // etat actuel du chargeur
private var reloadDelay : int = 3; // tps de rechargement en secondes
private var range : int = 12.5; // portee
private var rSpeed :int = 4; // vitesse de rotation
private var shotPower = 2000; //velocite des bullets
private var flashIntensity : float = 2;
private var flashFadeSpeed : float = 20;
private var shotLight : Light;


private var lastShot : float = 0; // temps depuis le dernier tir

function Start () 
{
	target = GameObject.FindWithTag("Player");
	shotLight = GetComponentInChildren(Light);
	shotLight.intensity = 0;
}

function Update () 
{
	var dist = Vector3.Distance(target.transform.position, transform.position);
	lastShot += Time.deltaTime;
	if (dist < range)
	{
		var rotate = Quaternion.LookRotation((target.transform.position + Vector3(0, 2 ,0)) - transform.position);
		transform.rotation = Quaternion.Slerp(transform.rotation, rotate, Time.deltaTime * rSpeed);

		switch (action)
		{
			case SentinelleAction.Reloading:
				if (lastShot > reloadDelay)
					actionChange(SentinelleAction.Fireing);
			break;
			
			case SentinelleAction.Fireing:
				if (lastShot * 1000 > (1000 / fireRate))
				{
					if (capacity > 0)
					{
						shot(rotate);
						capacity -= 1;
					}
					else
						actionChange(SentinelleAction.Reloading);
				}
			break;
		}
	}
	shotLight.intensity = Mathf.Lerp(shotLight.intensity, 0, flashFadeSpeed * Time.deltaTime);
}

function actionChange(newAction : SentinelleAction)
{
	action = newAction;
	switch (action)
	{
		case SentinelleAction.Reloading:
			capacity = capacityMax;
		break;
		
		case SentinelleAction.Fireing:
		break;
	}
}

function shot(rotate)
{
	audio.PlayOneShot(atkSound);
	var firedBullet = Instantiate(bullet, transform.Find("BulletStart").transform.position, rotate);	
	firedBullet.rigidbody.AddForce(transform.forward * shotPower);
	lastShot = 0;
	shotLight.intensity = flashIntensity;
}
