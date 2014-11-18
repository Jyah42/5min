#pragma strict

function Start () {

}

function Update () {

}

function Boom() {
	Destroy(gameObject);
}

function NextLevel(lvl: int) {
	Application.LoadLevel(lvl);
}