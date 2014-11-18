#pragma strict

var bullet : Transform;
var atkSound : AudioClip;

enum TourelleAction
{
	Fireing,
	Reloading
}

private var target : GameObject;
private var action : TourelleAction = TourelleAction.Reloading;
private var fireRate : float = 0.5; // nb shot/sec
private var capacityMax : int = 10; // capacite du chargeur
private var capacity : int = 0; // etat actuel du chargeur
private var reloadDelay : int = 1; // tps de rechargement en secondes
private var range : int = 10; // portee
private var rSpeed :int = 10; // vitesse de rotation
private var shotPower = 3000; //velocite des bullets
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
			case TourelleAction.Reloading:
				if (lastShot > reloadDelay)
					actionChange(TourelleAction.Fireing);
			break;
			
			case TourelleAction.Fireing:
				if (lastShot * 1000 > (1000 / fireRate))
				{
					if (capacity > 0)
					{
						shot(rotate);
						capacity -= 1;
					}
					else
						actionChange(TourelleAction.Reloading);
				}
			break;
		}
	}
	shotLight.intensity = Mathf.Lerp(shotLight.intensity, 0, flashFadeSpeed * Time.deltaTime);
}

function actionChange(newAction : TourelleAction)
{
	action = newAction;
	switch (action)
	{
		case TourelleAction.Reloading:
			capacity = capacityMax;
		break;
		
		case TourelleAction.Fireing:
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