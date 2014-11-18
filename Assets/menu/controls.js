#pragma strict

var label_style: 		GUIStyle = GUIStyle();
var label_style_name:	GUIStyle = GUIStyle();
var custom_skin: 		GUISkin;

function Start () {

}

function Update () {

}


function OnGUI() {

	GUI.Label(Rect(Screen.width / 2 - 145, Screen.height / 2 - 200, 200, 200), "Controles", label_style);
	
	GUI.Label(Rect(Screen.width / 2 - 350, Screen.height / 2 - 100, 200, 200), "Avancer", label_style_name);
	GUI.Label(Rect(Screen.width / 2 + 130, Screen.height / 2 - 100, 200, 200), "W / Fleche haut", label_style_name);
	GUI.Label(Rect(Screen.width / 2 - 350, Screen.height / 2 - 70, 200, 200), "Reculer", label_style_name);
	GUI.Label(Rect(Screen.width / 2 + 130, Screen.height / 2 - 70, 200, 200), "S / Fleche arriere", label_style_name);
	GUI.Label(Rect(Screen.width / 2 - 350, Screen.height / 2 - 40, 200, 200), "Aller a droite", label_style_name);
	GUI.Label(Rect(Screen.width / 2 + 130, Screen.height / 2 - 40, 200, 200), "A / Fleche gauche", label_style_name);
	GUI.Label(Rect(Screen.width / 2 - 350, Screen.height / 2 - 10, 200, 200), "Aller a gauche", label_style_name);
	GUI.Label(Rect(Screen.width / 2 + 130, Screen.height / 2 - 10, 200, 200), "D / Fleche droite", label_style_name);
	GUI.Label(Rect(Screen.width / 2 - 350, Screen.height / 2 + 20, 200, 200), "Epee", label_style_name);
	GUI.Label(Rect(Screen.width / 2 + 130, Screen.height / 2 + 20, 200, 200), "1 / E", label_style_name);
	GUI.Label(Rect(Screen.width / 2 - 350, Screen.height / 2 + 50, 200, 200), "Bouclier", label_style_name);
	GUI.Label(Rect(Screen.width / 2 + 130, Screen.height / 2 + 50, 200, 200), "2 / Q", label_style_name);
	GUI.Label(Rect(Screen.width / 2 - 350, Screen.height / 2 + 80, 200, 200), "Potion", label_style_name);
	GUI.Label(Rect(Screen.width / 2 + 130, Screen.height / 2 + 80, 200, 200), "3", label_style_name);
	GUI.Label(Rect(Screen.width / 2 - 350, Screen.height / 2 + 120, 200, 200), "Lacher potion", label_style_name);
	GUI.Label(Rect(Screen.width / 2 + 130, Screen.height / 2 + 120, 200, 200), "Espace", label_style_name);
	GUI.Label(Rect(Screen.width / 2 - 350, Screen.height / 2 + 150, 200, 200), "Camera", label_style_name);
	GUI.Label(Rect(Screen.width / 2 + 130, Screen.height / 2 + 150, 200, 200), "C", label_style_name);
	GUI.Label(Rect(Screen.width / 2 - 350, Screen.height / 2 + 180, 200, 200), "Pause", label_style_name);
	GUI.Label(Rect(Screen.width / 2 + 130, Screen.height / 2 + 180, 200, 200), "Echape", label_style_name);
	
	GUI.skin = custom_skin;
	if (GUI.Button(Rect(10, Screen.height - 40, 180, 30), "Retour")) {
		Application.LoadLevel("main_menu");
	}
}