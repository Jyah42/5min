#pragma strict

function Start () {
	transform.position.y = 0.3;
}

function Update () {

}

function Boom() {
	Destroy(gameObject);
}