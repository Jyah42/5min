#pragma strict

var cam: 						GameObject;
var player: 					GameObject;
var label_style: 				GUIStyle = GUIStyle();
var label_style2: 				GUIStyle = GUIStyle();
var custom_skin: 				GUISkin;

private var total_time: 				double = 0;
private var level_time: 				double = 0;
private var max_time: 					double = 300;
private var score:						int = 0;
private var player_is_dead: 			boolean = false;
private var cristals:					int = 0;
private var boss_is_dead:				boolean = false;

function Start () {
	DontDestroyOnLoad(gameObject);
}

function Update () {
	if (Time.timeScale != 0.0) { 
		if (Time.realtimeSinceStartup >= level_time + 1.0) {
			level_time = Time.realtimeSinceStartup;
			total_time += 1;
			cam.SendMessage("UpdateTime", max_time - total_time);
		}
	}

}

function OnGUI() {
	if (Application.loadedLevelName == "boss_level"
		&& boss_is_dead) {
		GUI.Label(Rect(Screen.width / 2 - 200, Screen.height / 2 - 130, 200, 200), "Felicitation !", label_style2);
		GUI.Label(Rect(Screen.width / 2 - 410, Screen.height / 2 - 30, 200, 200), "Vous avez vaincu le Boss !", label_style2);
		GUI.Label(Rect(Screen.width / 2 - 220, Screen.height / 2 + 70, 200, 200), "Votre score: " + score, label_style2);
		GUI.skin = custom_skin;
		if (GUI.Button(Rect(Screen.width - 240, Screen.height - 40, 230, 30), "Enregistrer le score")) {
			var score_saver = GameObject.FindWithTag("ScoreSaver");
			score_saver.SendMessage("SetScoreFromBoss", score);
			Destroy(GameObject.Find("Player"));
			Application.LoadLevel("save_score");
		}
	} else if (Application.loadedLevelName != "boss_level"
	 	&& total_time >= max_time) {
		if (player_is_dead == false) {
			player.SendMessage("SetDead");
			player_is_dead = true;
		}
	
		GUI.Label(Rect(Screen.width / 2 - 250, Screen.height / 2 - 130, 200, 200), "Vous etes", label_style);
		GUI.Label(Rect(Screen.width / 2 - 165, Screen.height / 2 , 200, 200), "MORT !", label_style);
		
		GUI.skin = custom_skin;
		if (GUI.Button(Rect(10, Screen.height - 40, 250, 30), "Retourner au menu")) {
			Application.LoadLevel("main_menu");
		}
		if (GUI.Button(Rect(Screen.width - 150, Screen.height - 40, 140, 30), "Rejouer")) {
			Destroy(GameObject.Find("Player"));
			Application.LoadLevel("Niveau_-1");
		}
	} else if (Application.loadedLevelName == "boss_level"
			   && cristals <= 0) {
		if (player_is_dead == false) {
			player.SendMessage("SetDead");
			player_is_dead = true;
		}
	
		GUI.Label(Rect(Screen.width / 2 - 240, Screen.height / 2 - 130, 200, 200), "Vous etes", label_style);
		GUI.Label(Rect(Screen.width / 2 - 165, Screen.height / 2 , 200, 200), "MORT !", label_style);
		
		GUI.skin = custom_skin;
		if (GUI.Button(Rect(10, Screen.height - 40, 250, 30), "Retourner au menu")) {
			Destroy(GameObject.Find("Player"));
			Application.LoadLevel("main_menu");
		}
		if (GUI.Button(Rect(Screen.width - 150, Screen.height - 40, 140, 30), "Rejouer")) {
			Destroy(GameObject.Find("Player"));
			Application.LoadLevel("Niveau_-1");
		}
	}
}

function AddEternityGS(quantity: int) {
	cristals += quantity;
}

function BossIsDead() {
	score += cristals;
	boss_is_dead = true;
}

function SetScoreBeforeBoss() {
	score = cristals + (max_time - total_time);
}