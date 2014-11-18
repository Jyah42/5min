#pragma strict

var custom_skin: 		GUISkin;
var label_style:		GUIStyle = GUIStyle();

private var timer: 		double = 0;
private var last_time:  double = 0;

function Start () {

}

function Update () {

}

function OnGUI() {
	if (Application.loadedLevelName == "boss_level") {
		if (Time.realtimeSinceStartup >= last_time + 1.0) {
			last_time = Time.realtimeSinceStartup;
			timer += 1;
		}
		
		if (timer <= 10) {
			GUI.skin = custom_skin;
			GUI.Label(Rect(Screen.width / 2 - 460, Screen.height / 2 - 60, 200, 200), "Contre le boss votre vos critaux sont votre vie", label_style);
			GUI.Label(Rect(Screen.width / 2 - 360, Screen.height / 2 - 20, 200, 200), "Vous mourrez si vous les perdez tous...", label_style);
		}
	}
}