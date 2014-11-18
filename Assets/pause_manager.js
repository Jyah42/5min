#pragma strict

var label_style: 		GUIStyle = GUIStyle();
var custom_skin: 		GUISkin;

function Start() {

}


function Update()
{
   if(Input.GetKeyDown("escape")) {        
		if (Time.timeScale == 1.0) {
		    Time.timeScale = 0.0;
		} else {
		    Time.timeScale = 1.0;	            
		}
	}
}

function OnGUI() {
	
	if (Time.timeScale != 1.0) { 
		GUI.Label(Rect(Screen.width / 2 - 80, Screen.height / 2 - 200, 200, 200), "Pause", label_style);
		
		GUI.skin = custom_skin;
	
		GUI.BeginGroup(Rect(Screen.width / 2 - 135, Screen.height / 2 - 100, 260, 260));
		
		if (GUI.Button(Rect(10, 40, 250, 30), "Retourner au menu")) {
			Time.timeScale = 1.0;
			Application.LoadLevel("main_menu");
		}
		if (GUI.Button(Rect(10, 80, 250, 30), "Reprendre")) {
			Time.timeScale = 1.0;
		}
		if (GUI.Button(Rect(10, 120, 250, 30), "Quitter le jeu")) {
			Application.Quit();
		}
		
		GUI.EndGroup();
	}
}