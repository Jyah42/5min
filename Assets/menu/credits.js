#pragma strict

var label_style: 		GUIStyle = GUIStyle();
var label_style_name:	GUIStyle = GUIStyle();
var custom_skin: 		GUISkin;

function Start () {

}

function Update () {

}


function OnGUI() {

	GUI.Label(Rect(Screen.width / 2 - 120, Screen.height / 2 - 200, 200, 200), "Credits", label_style);
	
	GUI.Label(Rect(Screen.width / 2 - 170, Screen.height / 2 - 100, 200, 200), "Francois Portalis", label_style_name);
	GUI.Label(Rect(Screen.width / 2 - 170, Screen.height / 2 - 70, 200, 200), "Jeremy Le Rouzo", label_style_name);
	GUI.Label(Rect(Screen.width / 2 - 150, Screen.height / 2 - 40, 200, 200), "Nicolas Magere", label_style_name);
	GUI.Label(Rect(Screen.width / 2 - 170, Screen.height / 2 - 10, 200, 200), "Pierre Courteille", label_style_name);
	GUI.Label(Rect(Screen.width / 2 - 145, Screen.height / 2 + 20, 200, 200), "Jeremy Letang", label_style_name);
	
	GUI.skin = custom_skin;
	if (GUI.Button(Rect(10, Screen.height - 40, 180, 30), "Retour")) {
		Application.LoadLevel("main_menu");
	}
}