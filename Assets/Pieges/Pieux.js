#pragma strict

var tmp : float;
var stay : boolean = false;
var up : boolean = false;

function Start () {
tmp = Time.time;
}

function Update () {
var diftmp : float = Time.time - tmp;
if (stay && diftmp > 1.2)
	stay = false;
else if (!stay) {
	if (!up) {
		if (transform.position.y > -2.2) {
			transform.position.y -= 0.2; }
		else {
			stay = true;
			up = true;
			tmp = Time.time; }
			}
	else if (up) {
		if (transform.position.y < 0) {
			transform.position.y += 0.2; }
		else {
			stay = true;
			up = false;
			tmp = Time.time; }
			}
	}
}