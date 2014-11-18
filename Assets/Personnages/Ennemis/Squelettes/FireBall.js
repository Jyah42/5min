#pragma strict

public var corps : GameObject;
private var target : GameObject;
var maxLifeTime : float = 5;
private var speed : int = 15;
private var rSpeed : int = 3;
private var timer : float = 0;
var dead = 0;
var startSound	:AudioClip;

function Awake()
{
	Destroy (gameObject, maxLifeTime);
	target = GameObject.FindWithTag("Player");
	dead = 0;
	audio.PlayOneShot(startSound);
}

function Update()
{
	if (dead == 0)
	{
		timer += Time.deltaTime;
		if (timer < 3)
		{
			var dist = Vector3.Distance(target.transform.position, transform.position);
			var rotate = Quaternion.LookRotation((target.transform.position + Vector3(0, 1 ,0)) - transform.position);
			transform.rotation = Quaternion.Slerp(transform.rotation, rotate, Time.deltaTime * rSpeed);
		}
		transform.position += transform.forward * speed * Time.deltaTime;
	}
}


function OnTriggerEnter(other : Collider)
{
	if (other.name == "Player")
	{
		var mycollider:SphereCollider = corps.GetComponent(SphereCollider);
		mycollider.enabled = false;
	}

	if (dead == 0 && timer > 0.5)
	{
		Destroy (gameObject, 0.3);
		dead = 1;
	}
}
