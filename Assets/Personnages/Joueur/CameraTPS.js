#pragma strict

public var target : Transform;
public var targetHeight : float = 1.7;
public var distance : float = 3.0;
public var offsetFromWall :float = 0.1;

public var maxDistance : float = 20;
public var minDistance : float = 0.6;
 
public var xSpeed : float = 200.0;
public var ySpeed : float = 200.0;
public var targetSpeed : float = 15.0;
 
public var yMinLimit : int = -80;
public var yMaxLimit : int = 80;

public var zoomRate : int = 40;

public var rotationDampening : float = 3.0;
public var zoomDampening : float = 5.0;

public var collisionLayers : LayerMask = -1;

private var xDeg : float = 5.0;
private var yDeg : float = 0.0;
private var currentDistance : float;
private var desiredDistance : float;
private var correctedDistance : float;

var tps : boolean = false;
 
function Start ()
{
	//var angles : Vector3 = transform.eulerAngles;
    xDeg = transform.localRotation.eulerAngles.x;
    yDeg = transform.localRotation.eulerAngles.y + 15;

    currentDistance = distance;
    desiredDistance = distance;
    correctedDistance = distance;

    if (rigidbody)
        rigidbody.freezeRotation = true;
        
    placeNormal();
    tps = false;

}
 
function LateUpdate()
{
  GetComponent(HUD).enabled = true;
	 if(Input.GetKeyDown("c")) 
	 {
	 	gameObject.SendMessage("DisplayIconeCamera");
	 	tps = !tps;
		 if (!tps)
		 	placeNormal();
	}
	if (tps)
	{
		modeTps();
	}
}	

function placeNormal()
{
	transform.localPosition.x = 0;
 	transform.localPosition.y = 1.6;
 	transform.localPosition.z = 0;
 	transform.localRotation.eulerAngles.x = 75;
 	transform.localRotation.eulerAngles.y = 0;
 	transform.localRotation.eulerAngles.z = 0;
}

function modeTps ()
{
   var vTargetOffset : Vector3;

    if (!target)
        return;

    if (Input.GetMouseButton(0))
    {
        xDeg += Input.GetAxis ("Mouse X") * xSpeed * 0.02;
        yDeg -= Input.GetAxis ("Mouse Y") * ySpeed * 0.02;
    }
	else if (Input.GetMouseButton(1))
	{
		var targetRotationAngle : float = target.eulerAngles.y;
		var currentRotationAngle : float = transform.eulerAngles.y;
		xDeg = Mathf.LerpAngle (currentRotationAngle, targetRotationAngle, rotationDampening * Time.deltaTime);    
		target.transform.Rotate(0, Input.GetAxis ("Mouse X") * xSpeed * 0.02, 0);
		xDeg += Input.GetAxis ("Mouse X") * xSpeed * 0.02;
	}
    else if (Input.GetAxis("Vertical") != 0 || Input.GetAxis("Horizontal") != 0)
    {
  		var targetRotationAngle1 : float = target.eulerAngles.y;
		var currentRotationAngle1 : float = transform.eulerAngles.y;
        xDeg = Mathf.LerpAngle (currentRotationAngle1, targetRotationAngle1, rotationDampening * Time.deltaTime);
    }
	yDeg = ClampAngle (yDeg, yMinLimit, yMaxLimit);

    var rotation : Quaternion = Quaternion.Euler (yDeg, xDeg, 0);


    desiredDistance -= Input.GetAxis ("Mouse ScrollWheel") * Time.deltaTime * zoomRate * Mathf.Abs (desiredDistance);
    desiredDistance = Mathf.Clamp (desiredDistance, minDistance, maxDistance);
    correctedDistance = desiredDistance;

    vTargetOffset = new Vector3 (0, -targetHeight, 0);
    var position : Vector3 = target.position - (rotation * Vector3.forward * desiredDistance + vTargetOffset);

    var collisionHit : RaycastHit;
    var trueTargetPosition : Vector3 = new Vector3 (target.position.x, target.position.y + targetHeight, target.position.z);

    var isCorrected : boolean = false;
    if (Physics.Linecast (trueTargetPosition, position, collisionHit, collisionLayers.value))
    {
        correctedDistance = Vector3.Distance (trueTargetPosition, collisionHit.point) - offsetFromWall;
        isCorrected = true;
    }
    
    currentDistance = !isCorrected || correctedDistance > currentDistance ? Mathf.Lerp (currentDistance, correctedDistance, Time.deltaTime * zoomDampening) : correctedDistance;
    currentDistance = Mathf.Clamp (currentDistance, minDistance, maxDistance);
    position = target.position - (rotation * Vector3.forward * currentDistance + vTargetOffset);
    transform.rotation = rotation;
    transform.position = position;
}

private static function ClampAngle (angle : float, min : float, max : float) : float
{
    if (angle < -360)
        angle += 360;
    if (angle > 360)
        angle -= 360;
    return Mathf.Clamp(angle, min, max);
}