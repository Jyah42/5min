#pragma strict

enum Slide {
	Slide1,
	Slide2,
	Slide3,
	Slide4
}

var custom_skin: 		GUISkin;
var label_style:		GUIStyle = GUIStyle();
var current_slide: 		Slide = Slide.Slide1;

function Start () {

}

function Update () {

}

function OnGUI() {
	GUI.skin = custom_skin;
	if (current_slide == Slide.Slide4) {
		if (GUI.Button(Rect(10, Screen.height - 40, 180, 30), "Commencer")) {
			Application.LoadLevel("Niveau_-1");
		}
	} else {
		if (GUI.Button(Rect(10, Screen.height - 40, 180, 30), "Suivant")) {
			current_slide += 1;
		}
	}
	switch (current_slide) {
		case Slide.Slide1:
			GUI.Label(Rect(Screen.width / 2 - 290, Screen.height / 2 - 100, 200, 200), "Lors de la grande bataille de Sparte", label_style);
			GUI.Label(Rect(Screen.width / 2 - 230, Screen.height / 2 - 60, 200, 200), "vous etes le seul survivant.", label_style);
			GUI.Label(Rect(Screen.width / 2 - 370, Screen.height / 2 - 20, 200, 200), "Hades, dieu des enfers furieux de cet affront", label_style);
			GUI.Label(Rect(Screen.width / 2 - 180, Screen.height / 2 + 20, 200, 200), "met fin a votre vie...", label_style);
			break;
		case Slide.Slide2: 
			GUI.Label(Rect(Screen.width / 2 - 300, Screen.height / 2 - 60, 200, 200), "Vous etes dans le dedale des Enfers.", label_style);
			GUI.Label(Rect(Screen.width / 2 - 410, Screen.height / 2 - 20, 200, 200), "Trouvez un moyen de vous echapper de cet endroit", label_style);
			GUI.Label(Rect(Screen.width / 2 - 220, Screen.height / 2 + 20, 200, 200), "afin de revenir a la vie...", label_style);
			break;
		case Slide.Slide3:
			GUI.Label(Rect(Screen.width / 2 - 340, Screen.height / 2 - 100, 200, 200), "Vous avez 5 minutes avant que les enfers", label_style);
			GUI.Label(Rect(Screen.width / 2 - 230, Screen.height / 2 - 60, 200, 200), "se referement pour l'eternite", label_style);
			GUI.Label(Rect(Screen.width / 2 - 130, Screen.height / 2 - 20, 200, 200), "Depechez vous !!!", label_style);
			GUI.Label(Rect(Screen.width / 2 - 340, Screen.height / 2 + 20, 200, 200), "Ammassez autant de cristaux que possible.", label_style);
			GUI.Label(Rect(Screen.width / 2 - 280, Screen.height / 2 + 60, 200, 200), "Ils seront utiles en temps voulu...", label_style);
			break;
		case Slide.Slide4:
			GUI.Label(Rect(Screen.width / 2 - 50, Screen.height / 2 - 60, 200, 200), "Au fait", label_style);
			GUI.Label(Rect(Screen.width / 2 - 115, Screen.height / 2 - 20, 200, 200), "Ne paniquez pas", label_style);
			GUI.Label(Rect(Screen.width / 2 - 170, Screen.height / 2 + 20, 200, 200), "Vous etes deja mort...", label_style);
			break;
	}
}