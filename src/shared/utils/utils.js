import { fileURLToPath } from 'url';
import path from 'path';
import { google } from 'googleapis';

export const getDirname = importMetaUrl => {
	const __filename = fileURLToPath(importMetaUrl);
	return path.dirname(__filename);
};

export const createDiscountCode = function (length, percent) {
	const letters = generateRandomCharacters(8);
	const second = Math.floor(Math.random() * length * 10);
	return letters + second + percent;
};

export function replaceString(text, replace, replaceWith) {
	if (text == null) return '';
	let newString = '';
	for (let i = 0; i < text.length; i++) {
		if (text[i] == replace) newString += replaceWith;
		else newString += text[i];
	}
	return newString;
}

export function generateRandomCharacters(length) {
	const list = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
	var res = '';
	for (var i = 0; i < length; i++) {
		var rnd = Math.floor(Math.random() * list.length);
		res = res + list.charAt(rnd);
	}
	return res;
}

export function generateRandomPassword(length) {
	const list =
		'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ123456789.,!#$%&/()*+{}[]@-_';
	var res = '';
	for (var i = 0; i < length; i++) {
		var rnd = Math.floor(Math.random() * list.length);
		res = res + list.charAt(rnd);
	}
	return res;
}

export function filterADifferenceB(A, B) {
	const difference = A.filter(itemA => {
		const index = B.findIndex(itemB => itemB == itemA);
		if (index == -1) return true;
		return false;
	});
	return difference;
}

export function filterADifferenceBFromCart(A, B) {
	const difference = A.filter(itemA => {
		const index = B.findIndex(itemB => itemB.id == itemA.id);
		if (index == -1) return true;
		return false;
	});
	return difference;
}

export function removeDoubles(arrays) {
	const masterArray = [];
	arrays.forEach(element => {
		masterArray.concat(element);
	});

	const newArr = [];
	const finalArr = masterArray.filter(item => {
		const find = newArr.find(itemN => itemN == item);
		if (find) return false;
		newArr.push(item);
		return true;
	});

	return finalArr;
}

export async function getDriveFileStream(fileId, auth) {
	const drive = google.drive({ version: 'v3', auth });

	return new Promise((resolve, reject) => {
		drive.files.get(
			{ fileId, alt: 'media' },
			{ responseType: 'stream' },
			(err, res) => {
				if (err) {
					return reject(err);
				}
				resolve(res);
			}
		);
	});
}

export function parseRange(rangeHeader, fileSize) {
	console.log(rangeHeader);
	const matches = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader);
	if (!matches) {
		throw new Error('Invalid Range header');
	}

	let start = parseInt(matches[1], 10);
	let end = parseInt(matches[2], 10);

	if (isNaN(start)) {
		start = fileSize - end;
		end = fileSize - 1;
	} else if (isNaN(end)) {
		end = fileSize - 1;
	}

	if (start > end || start < 0 || end >= fileSize) {
		throw new Error('Invalid range');
	}

	return [start, end];
}

export function getDateNow(date = new Date()) {
	const h = date.getHours();
	const m = date.getMinutes();
	const s = date.getSeconds();
	const y = date.getFullYear();
	const mo = date.getMonth();
	const d = date.getDate();
	return `${y}-${mo}-${d} ${fNum(h)}:${fNum(m)}:${fNum(s)}`;
}

export function getFutureDate(num) {
	const date = new Date();
	const y = date.getFullYear();
	const mo = date.getMonth();
	const d = date.getDate();
	const h = date.getHours();
	const m = date.getMinutes();
	const s = date.getSeconds();
	return new Date(y, mo, d + num, h, m, s);
}

/**
 * Compara dos fechas y retorna true si la primera fecha es mayor que la segunda y viseversa
 */
export function compareDates(date1 = new Date(), date2 = new Date()) {
	const first = new Date(date1).getTime();
	const sec = new Date(date2).getTime();
	if (first > sec) {
		return true;
	}
	return false;
}

function fNum(num) {
	return isNaN(num) ? null : num < 10 ? `0${num}` : num;
}
