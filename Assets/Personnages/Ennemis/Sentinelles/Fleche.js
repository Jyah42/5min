#pragma strict


public var Fumee : GameObject;
public var corps : GameObject;
var maxLifeTime : float = 3;
private var lifeTime : float = 0;

function Awake()
{
	Destroy (gameObject, maxLifeTime);
	Fumee.GetComponent(ParticleSystem).emissionRate = 32;
}


function Update () 
{	
	lifeTime += Time.deltaTime;
	if (lifeTime > 1)
		Fumee.GetComponent(ParticleSystem).emissionRate = 0;
}

function OnColliderEnter(other : Collider)
{
	if (other.name == "Player")
	{
		var mycollider:CapsuleCollider = corps.GetComponent(CapsuleCollider);
		mycollider.enabled = false;
	}
}