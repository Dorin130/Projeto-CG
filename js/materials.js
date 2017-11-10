var WIREFRAME = false;

var TABLE_MATERIAL = [new THREE.MeshPhongMaterial({color: 0x5B1F03,specular: 0x100202,shininess: 10}), new THREE.MeshLambertMaterial( {color: 0x5B1F03})];

var BUTTER_MATERIAL = [new THREE.MeshPhongMaterial({color: 0xFFFF00,specular: 0x020202,shininess: 50}), new THREE.MeshLambertMaterial( {color: 0xFFFF00})];

var ORANGE_BODY_MATERIAL =  [new THREE.MeshPhongMaterial({color: 0xF69D03,specular: 0x020202,shininess: 200}), new THREE.MeshLambertMaterial( {color: 0xF69D03})];
var ORANGE_LEAF_MATERIAL =  [new THREE.MeshPhongMaterial({color: 0x236e2b,specular: 0x020202,shininess: 50}), new THREE.MeshLambertMaterial( {color: 0x236e2b})];
var ORANGE_CONE_MATERIAL =  [new THREE.MeshPhongMaterial({color: 0x144a1a,specular: 0x020202,shininess: 10}), new THREE.MeshLambertMaterial( {color: 0x144a1a})];

var CHEERIO_MATERIALS = [[ new THREE.MeshPhongMaterial({color: 0x8B5555,specular: 0x020202,shininess: 20}), new THREE.MeshLambertMaterial({color: 0x8B5555}) ],
						 [ new THREE.MeshPhongMaterial({color: 0x94A35E,specular: 0x020202,shininess: 20}), new THREE.MeshLambertMaterial({color: 0x94A35E}) ],
						 [ new THREE.MeshPhongMaterial({color: 0xD98056,specular: 0x020202,shininess: 20}), new THREE.MeshLambertMaterial({color: 0xD98056}) ],
						 [ new THREE.MeshPhongMaterial({color: 0xDB5742,specular: 0x020202,shininess: 20}), new THREE.MeshLambertMaterial({color: 0xDB5742}) ],
						 [ new THREE.MeshPhongMaterial({color: 0xE45640,specular: 0x020202,shininess: 20}), new THREE.MeshLambertMaterial({color: 0xE45640}) ]];

var CAR_DOME_MATERIAL = [new THREE.MeshPhongMaterial({color: 0x25272b,specular: 0x020202,shininess: 1000, transparent:true, opacity:0.8}), new THREE.MeshLambertMaterial( {color: 0x25272b, transparent:true, opacity:0.8})];
var CAR_RIMS_MATERIAL = [new THREE.MeshPhongMaterial({color: 0xc0c0c0,specular: 0x020202,shininess: 230}), new THREE.MeshLambertMaterial( {color: 0xc0c0c0})];
var CAR_HUB_MATERIAL = [new THREE.MeshPhongMaterial({color: 0x808080,specular: 0x020202,shininess: 230}), new THREE.MeshLambertMaterial( {color: 0x808080})];
var CAR_WHEEL_MATERIAL = [new THREE.MeshPhongMaterial({color: 0x202020,specular: 0x010101,shininess: 10}), new THREE.MeshLambertMaterial( {color: 0x202020})];
var CAR_BODY_MATERIAL = [new THREE.MeshPhongMaterial({color: 0xaa0000,specular: 0xaa0000,shininess: 150}), new THREE.MeshLambertMaterial( {color: 0xaa0000})];
var CAR_SPOILSUP_MATERIAL = [new THREE.MeshPhongMaterial({color: 0xaa0000,specular: 0xaa0000,shininess: 150}), new THREE.MeshLambertMaterial( {color: 0xaa0000})];
var CAR_SPOILTOP_MATERIAL = [new THREE.MeshPhongMaterial({color: 0x25272b,specular: 0x020202,shininess: 400}), new THREE.MeshLambertMaterial( {color: 0x25272b})];
var CAR_ORNAMENT_MATERIAL = [new THREE.MeshPhongMaterial({color: 0xaaaaaa,specular: 0xaaaaaa,shininess: 1000}), new THREE.MeshLambertMaterial( {color: 0xaaaaaa})];

var CANDLE_MATERIAL = [new THREE.MeshPhongMaterial({color: 0xaa0000,specular: 0x020202,shininess: 180}), new THREE.MeshLambertMaterial( {color: 0xaa0000})];
var CANDLE_BASE_MATERIAL = [new THREE.MeshPhongMaterial({color: 0xaaaaaa,specular: 0x020202,shininess: 230}), new THREE.MeshLambertMaterial( {color: 0xaaaaaa})];