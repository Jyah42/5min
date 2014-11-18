#pragma strict
var lootSound	:AudioClip;

function Start () {
	transform.position.y = 0.5;
}

function Update () {

}

function Boom() {
	audio.PlayOneShot(lootSound);
	Destroy(gameObject, 0.5);
}
