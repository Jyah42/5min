#pragma strict

var label_style: 		GUIStyle = GUIStyle();
var custom_skin: 		GUISkin;

function Start() {
	Destroy(GameObject.Find("ScoreSaver"));
	Destroy(GameObject.Find("Player"));
}

function OnGUI () {

	GUI.Label(Rect(Screen.width / 2 - 370, Screen.height / 2 - 200, 200, 200), "5 minutes pour l'eternite", label_style);
	GUI.skin = custom_skin;
	
	GUI.BeginGroup(Rect(Screen.width / 2 - 100, Screen.height / 2 - 100, 250, 250));
	
	if (GUI.Button(Rect(10, 40, 180, 30), "Jouer")) {
		Application.LoadLevel("story");
	}
	if (GUI.Button(Rect(10, 80, 180, 30), "Scores")) {
		Application.LoadLevel("high_score");
	}
	if (GUI.Button(Rect(10, 120, 180, 30), "Controles")) {
		Application.LoadLevel("controls");
	}
	if (GUI.Button(Rect(10, 160, 180, 30), "Credits")) {
		Application.LoadLevel("credits");
	}
	if (GUI.Button(Rect(10, 200, 180, 30), "Quitter")) {
		Application.Quit();
	}
	GUI.EndGroup();
}