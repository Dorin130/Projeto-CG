class roadSegment {
	//RoadSegmentWidth, TorusRadius, TorusTubeRadius and Color are optional
	constructor(PosX, PosY, PosZ, Direction, RoadSegmentWidth, TorusRadius, TorusTubeRadius, Color) {
		var RoadSegmentWidth = RoadSegmentWidth || 110;
		var TorusRadius = TorusRadius || 30;
		var TorusTubeRadius = TorusTubeRadius || 10 // 3:1 ratio between the radius and the tube.
		var Color = Color || 0xffff00;

		var RadialSegments = 16;
		var TubularSegments = 18;
		var Direction = Direction || Math.PI/2;

		this.roadSegment = new THREE.Object3D();

		var geometry = new THREE.TorusGeometry( TorusRadius, TorusTubeRadius, RadialSegments, TubularSegments );
		var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
		var leftTorus = new THREE.Mesh( geometry, material );
		var rightTorus = new THREE.Mesh( geometry, material );

		leftTorus.position.set(PosX - RoadSegmentWidth, PosY, PosZ);
		leftTorus.rotation.x = Math.PI/2;

		rightTorus.position.set(PosX + RoadSegmentWidth, PosY, PosZ);
		rightTorus.rotation.x = Math.PI/2;

		this.roadSegment.add(leftTorus);
		this.roadSegment.add(rightTorus);
		
	}
	setPosition(PosX, PosY, PosZ) {
		this.roadSegment.position.set(PosX, PosY, PosZ)
	}

	setRotation(RotX, RotY, RotZ) {
		this.roadSegment.rotation.set(RotX, RotY, RotZ);
	}

	getObject() {
		return this.roadSegment;
	}
}


class straightRoad {
	constructor(PosX, PosY, PosZ, Direction, nrSegments, RoadSpaceBetweenSegments, RoadSegmentWidth, TorusRadius, TorusTubeRadius, Color) {
		var RoadSpaceBetweenSegments = RoadSpaceBetweenSegments || 20;
		var RoadSegmentWidth = RoadSegmentWidth || 110;
		var TorusRadius = TorusRadius || 30;
		var TorusTubeRadius = TorusTubeRadius || 10 // 3:1 ratio between the radius and the tube.
		var Color = Color || 0xffff00;

		var RadialSegments = 16;
		var TubularSegments = 18;

		this.nrSegments = nrSegments - 1;

		this.straightRoad = new THREE.Object3D();
		var x = 0;
		var y = 0;
		var z = 0;

		for(var i = 0; i < nrSegments; i++) {
			var segment = new roadSegment(x, 
										  y, 
										  z,
										  Math.PI, 
										  RoadSegmentWidth, 
										  TorusRadius, 
										  TorusTubeRadius, 
										  Color);

			this.straightRoad.add(segment.getObject());
			z += 2*TorusRadius + RoadSpaceBetweenSegments;
		}

		this.straightRoad.rotation.y = Direction;
		this.straightRoad.position.set(PosX, PosY, PosZ);
	}
	setPosition(PosX, PosY, PosZ) {
		this.straightRoad.position.set(PosX, PosY, PosZ)
	}

	setRotation(RotX, RotY, RotZ) {
		this.straightRoad.rotation.set(RotX, RotY, RotZ);
	}
	//returns the position of the last road segment inserted in the straight road
	getPosition() {
		var children = this.straightRoad.children;
		return children[this.nrSegments].position;
	}

	getObject() {
		return this.straightRoad;
	}

}


class curvedRoad {
constructor(PosX, PosY, PosZ, Radius, Angle, RoadSpaceBetweenSegments, RoadSegmentWidth, TorusRadius, TorusTubeRadius, Color) {
		//STYLE VARIABLE
		this.RoadSpaceBetweenSegments = RoadSpaceBetweenSegments || 20;
		this.RoadSegmentWidth = RoadSegmentWidth || 110;
		this.TorusRadius = TorusRadius || 30;
		this.TorusTubeRadius = TorusTubeRadius || 10 // 3:1 ratio between the radius and the tube.
		this.Color = Color || 0xffff00;

		var perimeter = Angle*Radius;
		var nrSegmentsNeeded = perimeter / (2*TorusRadius + RoadSpaceBetweenSegments);


	}

}


//USE THIS CLASS FOR ROAD CREATION, IGNORE THE OTHERS
class road {

	constructor(PosX, PosY, PosZ, RoadSpaceBetweenSegments, RoadSegmentWidth, TorusRadius, TorusTubeRadius, Color) {
		//STYLE VARIABLE
		this.RoadSpaceBetweenSegments = RoadSpaceBetweenSegments || 20;
		this.RoadSegmentWidth = RoadSegmentWidth || 110;
		this.TorusRadius = TorusRadius || 30;
		this.TorusTubeRadius = TorusTubeRadius || 10 // 3:1 ratio between the radius and the tube.
		this.Color = Color || 0xffff00;

		//POSITION VARIABLES
		this.PosX = PosX;
		this.PosY = PosY;
		this.PosZ = PosZ; // let this one be 0 or the location of the base of the table
		this.Direction = Math.PI/2; //rotation around y axis

		//CLASS SPECIFIC VARIABLES
		this.roadSegments = []; //list to store the road;
		this.nrRoadSegments = 0; //number of road segments
		this.RoadBuilding = false; //atribute that controls wheter youre building a road or not
	}
	//PosX, PosY , PosZ and Direction are optional. 
	//You need to call this method everytime you want to start building a road at the given point
	roadBegin(Direction, PosX, PosY, PosZ) {
		this.RoadBuilding = true;
		this.Direction = Direction || this.Direction;
		this.PosX = PosX || this.PosX;
		this.PosY = PosY || this.PosY;
		this.PosZ = PosZ || this.PosZ;
	}
	//Use this one to build a single segment of the road
	segment() {
		if(!this.RoadBuilding) {
			console.log("Error in segment: You need to start building a road first");
		}
		else {
			var segment = new roadSegment(this.PosX,
									    	this.PosY,
										    this.PosZ,
										    this.Direction,
										    this.RoadSegmentWidth,
										    this.TorusRadius,
										  	this.TorusTubeRadius,
										  	this.Color);
			this.roadSegments[this.nrRoadSegments++] = segment;
			this.PosZ += 2*this.TorusRadius + this.RoadSpaceBetweenSegments;
			segment.getObject().rotation.y = this.Direction;
		}
	}
	//Use this one to build a straight road made out of nrSegments segments.
	straightRoad(nrSegments) {
		var position;
		if(!this.RoadBuilding) {
			console.log("Error in straightRoad: You need to start building a road first");
		}
		else {
			if(nrSegments && nrSegments > 0) {
				var road = new straightRoad(this.PosX,
										    this.PosY,
										    this.PosZ,
										  	this.Direction,
										    nrSegments,
										    this.RoadSpaceBetweenSegments,
										    this.RoadSegmentWidth,
										    this.TorusRadius,
										  	this.TorusTubeRadius,
										  	this.Color);
				this.roadSegments[this.nrRoadSegments++] = road;
				position = road.getPosition();
				//this.PosX = position.x;
				//this.PosY = position.y;
				this.PosZ = position.z;

			}			
		}
	}

	roadCurve() {

	}

	roadEnd() {
		if(this.RoadBuilding) {
			for(var i=0; i < this.nrRoadSegments; i++) {
				scene.add(this.roadSegments[i].getObject());
			}
		}
		else  {
			console.log("Error in roadEnd: You need to start building a road first");
		}

	}
}