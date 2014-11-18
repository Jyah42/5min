#pragma strict

function Start () {

}

function Update () {
	if (!animation.IsPlaying("dance")) {
		animation.Play("dance");
	}
}