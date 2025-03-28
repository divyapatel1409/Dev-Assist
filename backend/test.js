'use strict';

try {
	console.log(JSON.parse('{"regex": "^.+@gmail\.com$"}'));

} catch (error) {
	console.log(error.message)
}