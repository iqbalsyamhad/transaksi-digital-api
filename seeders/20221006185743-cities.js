'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		*/
		return queryInterface.bulkInsert(
			'Cities',
			[
				{
					"id": "1",
					"provinceId": "21",
					"province": "Nanggroe Aceh Darussalam (NAD)",
					"type": "Kabupaten",
					"name": "Aceh Barat",
					"postal_code": "23681"
				},
				{
					"id": "2",
					"provinceId": "21",
					"province": "Nanggroe Aceh Darussalam (NAD)",
					"type": "Kabupaten",
					"name": "Aceh Barat Daya",
					"postal_code": "23764"
				},
				{
					"id": "3",
					"provinceId": "21",
					"province": "Nanggroe Aceh Darussalam (NAD)",
					"type": "Kabupaten",
					"name": "Aceh Besar",
					"postal_code": "23951"
				},
				{
					"id": "4",
					"provinceId": "21",
					"province": "Nanggroe Aceh Darussalam (NAD)",
					"type": "Kabupaten",
					"name": "Aceh Jaya",
					"postal_code": "23654"
				},
				{
					"id": "5",
					"provinceId": "21",
					"province": "Nanggroe Aceh Darussalam (NAD)",
					"type": "Kabupaten",
					"name": "Aceh Selatan",
					"postal_code": "23719"
				},
				{
					"id": "6",
					"provinceId": "21",
					"province": "Nanggroe Aceh Darussalam (NAD)",
					"type": "Kabupaten",
					"name": "Aceh Singkil",
					"postal_code": "24785"
				},
				{
					"id": "7",
					"provinceId": "21",
					"province": "Nanggroe Aceh Darussalam (NAD)",
					"type": "Kabupaten",
					"name": "Aceh Tamiang",
					"postal_code": "24476"
				},
				{
					"id": "8",
					"provinceId": "21",
					"province": "Nanggroe Aceh Darussalam (NAD)",
					"type": "Kabupaten",
					"name": "Aceh Tengah",
					"postal_code": "24511"
				},
				{
					"id": "9",
					"provinceId": "21",
					"province": "Nanggroe Aceh Darussalam (NAD)",
					"type": "Kabupaten",
					"name": "Aceh Tenggara",
					"postal_code": "24611"
				},
				{
					"id": "10",
					"provinceId": "21",
					"province": "Nanggroe Aceh Darussalam (NAD)",
					"type": "Kabupaten",
					"name": "Aceh Timur",
					"postal_code": "24454"
				},
				{
					"id": "11",
					"provinceId": "21",
					"province": "Nanggroe Aceh Darussalam (NAD)",
					"type": "Kabupaten",
					"name": "Aceh Utara",
					"postal_code": "24382"
				},
				{
					"id": "12",
					"provinceId": "32",
					"province": "Sumatera Barat",
					"type": "Kabupaten",
					"name": "Agam",
					"postal_code": "26411"
				},
				{
					"id": "13",
					"provinceId": "23",
					"province": "Nusa Tenggara Timur (NTT)",
					"type": "Kabupaten",
					"name": "Alor",
					"postal_code": "85811"
				},
				{
					"id": "14",
					"provinceId": "19",
					"province": "Maluku",
					"type": "Kota",
					"name": "Ambon",
					"postal_code": "97222"
				},
				{
					"id": "15",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kabupaten",
					"name": "Asahan",
					"postal_code": "21214"
				},
				{
					"id": "16",
					"provinceId": "24",
					"province": "Papua",
					"type": "Kabupaten",
					"name": "Asmat",
					"postal_code": "99777"
				},
				{
					"id": "17",
					"provinceId": "1",
					"province": "Bali",
					"type": "Kabupaten",
					"name": "Badung",
					"postal_code": "80351"
				},
				{
					"id": "18",
					"provinceId": "13",
					"province": "Kalimantan Selatan",
					"type": "Kabupaten",
					"name": "Balangan",
					"postal_code": "71611"
				},
				{
					"id": "19",
					"provinceId": "15",
					"province": "Kalimantan Timur",
					"type": "Kota",
					"name": "Balikpapan",
					"postal_code": "76111"
				},
				{
					"id": "20",
					"provinceId": "21",
					"province": "Nanggroe Aceh Darussalam (NAD)",
					"type": "Kota",
					"name": "Banda Aceh",
					"postal_code": "23238"
				},
				{
					"id": "21",
					"provinceId": "18",
					"province": "Lampung",
					"type": "Kota",
					"name": "Bandar Lampung",
					"postal_code": "35139"
				},
				{
					"id": "22",
					"provinceId": "9",
					"province": "Jawa Barat",
					"type": "Kabupaten",
					"name": "Bandung",
					"postal_code": "40311"
				},
				{
					"id": "23",
					"provinceId": "9",
					"province": "Jawa Barat",
					"type": "Kota",
					"name": "Bandung",
					"postal_code": "40111"
				},
				{
					"id": "24",
					"provinceId": "9",
					"province": "Jawa Barat",
					"type": "Kabupaten",
					"name": "Bandung Barat",
					"postal_code": "40721"
				},
				{
					"id": "25",
					"provinceId": "29",
					"province": "Sulawesi Tengah",
					"type": "Kabupaten",
					"name": "Banggai",
					"postal_code": "94711"
				},
				{
					"id": "26",
					"provinceId": "29",
					"province": "Sulawesi Tengah",
					"type": "Kabupaten",
					"name": "Banggai Kepulauan",
					"postal_code": "94881"
				},
				{
					"id": "27",
					"provinceId": "2",
					"province": "Bangka Belitung",
					"type": "Kabupaten",
					"name": "Bangka",
					"postal_code": "33212"
				},
				{
					"id": "28",
					"provinceId": "2",
					"province": "Bangka Belitung",
					"type": "Kabupaten",
					"name": "Bangka Barat",
					"postal_code": "33315"
				},
				{
					"id": "29",
					"provinceId": "2",
					"province": "Bangka Belitung",
					"type": "Kabupaten",
					"name": "Bangka Selatan",
					"postal_code": "33719"
				},
				{
					"id": "30",
					"provinceId": "2",
					"province": "Bangka Belitung",
					"type": "Kabupaten",
					"name": "Bangka Tengah",
					"postal_code": "33613"
				},
				{
					"id": "31",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kabupaten",
					"name": "Bangkalan",
					"postal_code": "69118"
				},
				{
					"id": "32",
					"provinceId": "1",
					"province": "Bali",
					"type": "Kabupaten",
					"name": "Bangli",
					"postal_code": "80619"
				},
				{
					"id": "33",
					"provinceId": "13",
					"province": "Kalimantan Selatan",
					"type": "Kabupaten",
					"name": "Banjar",
					"postal_code": "70619"
				},
				{
					"id": "34",
					"provinceId": "9",
					"province": "Jawa Barat",
					"type": "Kota",
					"name": "Banjar",
					"postal_code": "46311"
				},
				{
					"id": "35",
					"provinceId": "13",
					"province": "Kalimantan Selatan",
					"type": "Kota",
					"name": "Banjarbaru",
					"postal_code": "70712"
				},
				{
					"id": "36",
					"provinceId": "13",
					"province": "Kalimantan Selatan",
					"type": "Kota",
					"name": "Banjarmasin",
					"postal_code": "70117"
				},
				{
					"id": "37",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kabupaten",
					"name": "Banjarnegara",
					"postal_code": "53419"
				},
				{
					"id": "38",
					"provinceId": "28",
					"province": "Sulawesi Selatan",
					"type": "Kabupaten",
					"name": "Bantaeng",
					"postal_code": "92411"
				},
				{
					"id": "39",
					"provinceId": "5",
					"province": "DI Yogyakarta",
					"type": "Kabupaten",
					"name": "Bantul",
					"postal_code": "55715"
				},
				{
					"id": "40",
					"provinceId": "33",
					"province": "Sumatera Selatan",
					"type": "Kabupaten",
					"name": "Banyuasin",
					"postal_code": "30911"
				},
				{
					"id": "41",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kabupaten",
					"name": "Banyumas",
					"postal_code": "53114"
				},
				{
					"id": "42",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kabupaten",
					"name": "Banyuwangi",
					"postal_code": "68416"
				},
				{
					"id": "43",
					"provinceId": "13",
					"province": "Kalimantan Selatan",
					"type": "Kabupaten",
					"name": "Barito Kuala",
					"postal_code": "70511"
				},
				{
					"id": "44",
					"provinceId": "14",
					"province": "Kalimantan Tengah",
					"type": "Kabupaten",
					"name": "Barito Selatan",
					"postal_code": "73711"
				},
				{
					"id": "45",
					"provinceId": "14",
					"province": "Kalimantan Tengah",
					"type": "Kabupaten",
					"name": "Barito Timur",
					"postal_code": "73671"
				},
				{
					"id": "46",
					"provinceId": "14",
					"province": "Kalimantan Tengah",
					"type": "Kabupaten",
					"name": "Barito Utara",
					"postal_code": "73881"
				},
				{
					"id": "47",
					"provinceId": "28",
					"province": "Sulawesi Selatan",
					"type": "Kabupaten",
					"name": "Barru",
					"postal_code": "90719"
				},
				{
					"id": "48",
					"provinceId": "17",
					"province": "Kepulauan Riau",
					"type": "Kota",
					"name": "Batam",
					"postal_code": "29413"
				},
				{
					"id": "49",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kabupaten",
					"name": "Batang",
					"postal_code": "51211"
				},
				{
					"id": "50",
					"provinceId": "8",
					"province": "Jambi",
					"type": "Kabupaten",
					"name": "Batang Hari",
					"postal_code": "36613"
				},
				{
					"id": "51",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kota",
					"name": "Batu",
					"postal_code": "65311"
				},
				{
					"id": "52",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kabupaten",
					"name": "Batu Bara",
					"postal_code": "21655"
				},
				{
					"id": "53",
					"provinceId": "30",
					"province": "Sulawesi Tenggara",
					"type": "Kota",
					"name": "Bau-Bau",
					"postal_code": "93719"
				},
				{
					"id": "54",
					"provinceId": "9",
					"province": "Jawa Barat",
					"type": "Kabupaten",
					"name": "Bekasi",
					"postal_code": "17837"
				},
				{
					"id": "55",
					"provinceId": "9",
					"province": "Jawa Barat",
					"type": "Kota",
					"name": "Bekasi",
					"postal_code": "17121"
				},
				{
					"id": "56",
					"provinceId": "2",
					"province": "Bangka Belitung",
					"type": "Kabupaten",
					"name": "Belitung",
					"postal_code": "33419"
				},
				{
					"id": "57",
					"provinceId": "2",
					"province": "Bangka Belitung",
					"type": "Kabupaten",
					"name": "Belitung Timur",
					"postal_code": "33519"
				},
				{
					"id": "58",
					"provinceId": "23",
					"province": "Nusa Tenggara Timur (NTT)",
					"type": "Kabupaten",
					"name": "Belu",
					"postal_code": "85711"
				},
				{
					"id": "59",
					"provinceId": "21",
					"province": "Nanggroe Aceh Darussalam (NAD)",
					"type": "Kabupaten",
					"name": "Bener Meriah",
					"postal_code": "24581"
				},
				{
					"id": "60",
					"provinceId": "26",
					"province": "Riau",
					"type": "Kabupaten",
					"name": "Bengkalis",
					"postal_code": "28719"
				},
				{
					"id": "61",
					"provinceId": "12",
					"province": "Kalimantan Barat",
					"type": "Kabupaten",
					"name": "Bengkayang",
					"postal_code": "79213"
				},
				{
					"id": "62",
					"provinceId": "4",
					"province": "Bengkulu",
					"type": "Kota",
					"name": "Bengkulu",
					"postal_code": "38229"
				},
				{
					"id": "63",
					"provinceId": "4",
					"province": "Bengkulu",
					"type": "Kabupaten",
					"name": "Bengkulu Selatan",
					"postal_code": "38519"
				},
				{
					"id": "64",
					"provinceId": "4",
					"province": "Bengkulu",
					"type": "Kabupaten",
					"name": "Bengkulu Tengah",
					"postal_code": "38319"
				},
				{
					"id": "65",
					"provinceId": "4",
					"province": "Bengkulu",
					"type": "Kabupaten",
					"name": "Bengkulu Utara",
					"postal_code": "38619"
				},
				{
					"id": "66",
					"provinceId": "15",
					"province": "Kalimantan Timur",
					"type": "Kabupaten",
					"name": "Berau",
					"postal_code": "77311"
				},
				{
					"id": "67",
					"provinceId": "24",
					"province": "Papua",
					"type": "Kabupaten",
					"name": "Biak Numfor",
					"postal_code": "98119"
				},
				{
					"id": "68",
					"provinceId": "22",
					"province": "Nusa Tenggara Barat (NTB)",
					"type": "Kabupaten",
					"name": "Bima",
					"postal_code": "84171"
				},
				{
					"id": "69",
					"provinceId": "22",
					"province": "Nusa Tenggara Barat (NTB)",
					"type": "Kota",
					"name": "Bima",
					"postal_code": "84139"
				},
				{
					"id": "70",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kota",
					"name": "Binjai",
					"postal_code": "20712"
				},
				{
					"id": "71",
					"provinceId": "17",
					"province": "Kepulauan Riau",
					"type": "Kabupaten",
					"name": "Bintan",
					"postal_code": "29135"
				},
				{
					"id": "72",
					"provinceId": "21",
					"province": "Nanggroe Aceh Darussalam (NAD)",
					"type": "Kabupaten",
					"name": "Bireuen",
					"postal_code": "24219"
				},
				{
					"id": "73",
					"provinceId": "31",
					"province": "Sulawesi Utara",
					"type": "Kota",
					"name": "Bitung",
					"postal_code": "95512"
				},
				{
					"id": "74",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kabupaten",
					"name": "Blitar",
					"postal_code": "66171"
				},
				{
					"id": "75",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kota",
					"name": "Blitar",
					"postal_code": "66124"
				},
				{
					"id": "76",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kabupaten",
					"name": "Blora",
					"postal_code": "58219"
				},
				{
					"id": "77",
					"provinceId": "7",
					"province": "Gorontalo",
					"type": "Kabupaten",
					"name": "Boalemo",
					"postal_code": "96319"
				},
				{
					"id": "78",
					"provinceId": "9",
					"province": "Jawa Barat",
					"type": "Kabupaten",
					"name": "Bogor",
					"postal_code": "16911"
				},
				{
					"id": "79",
					"provinceId": "9",
					"province": "Jawa Barat",
					"type": "Kota",
					"name": "Bogor",
					"postal_code": "16119"
				},
				{
					"id": "80",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kabupaten",
					"name": "Bojonegoro",
					"postal_code": "62119"
				},
				{
					"id": "81",
					"provinceId": "31",
					"province": "Sulawesi Utara",
					"type": "Kabupaten",
					"name": "Bolaang Mongondow (Bolmong)",
					"postal_code": "95755"
				},
				{
					"id": "82",
					"provinceId": "31",
					"province": "Sulawesi Utara",
					"type": "Kabupaten",
					"name": "Bolaang Mongondow Selatan",
					"postal_code": "95774"
				},
				{
					"id": "83",
					"provinceId": "31",
					"province": "Sulawesi Utara",
					"type": "Kabupaten",
					"name": "Bolaang Mongondow Timur",
					"postal_code": "95783"
				},
				{
					"id": "84",
					"provinceId": "31",
					"province": "Sulawesi Utara",
					"type": "Kabupaten",
					"name": "Bolaang Mongondow Utara",
					"postal_code": "95765"
				},
				{
					"id": "85",
					"provinceId": "30",
					"province": "Sulawesi Tenggara",
					"type": "Kabupaten",
					"name": "Bombana",
					"postal_code": "93771"
				},
				{
					"id": "86",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kabupaten",
					"name": "Bondowoso",
					"postal_code": "68219"
				},
				{
					"id": "87",
					"provinceId": "28",
					"province": "Sulawesi Selatan",
					"type": "Kabupaten",
					"name": "Bone",
					"postal_code": "92713"
				},
				{
					"id": "88",
					"provinceId": "7",
					"province": "Gorontalo",
					"type": "Kabupaten",
					"name": "Bone Bolango",
					"postal_code": "96511"
				},
				{
					"id": "89",
					"provinceId": "15",
					"province": "Kalimantan Timur",
					"type": "Kota",
					"name": "Bontang",
					"postal_code": "75313"
				},
				{
					"id": "90",
					"provinceId": "24",
					"province": "Papua",
					"type": "Kabupaten",
					"name": "Boven Digoel",
					"postal_code": "99662"
				},
				{
					"id": "91",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kabupaten",
					"name": "Boyolali",
					"postal_code": "57312"
				},
				{
					"id": "92",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kabupaten",
					"name": "Brebes",
					"postal_code": "52212"
				},
				{
					"id": "93",
					"provinceId": "32",
					"province": "Sumatera Barat",
					"type": "Kota",
					"name": "Bukittinggi",
					"postal_code": "26115"
				},
				{
					"id": "94",
					"provinceId": "1",
					"province": "Bali",
					"type": "Kabupaten",
					"name": "Buleleng",
					"postal_code": "81111"
				},
				{
					"id": "95",
					"provinceId": "28",
					"province": "Sulawesi Selatan",
					"type": "Kabupaten",
					"name": "Bulukumba",
					"postal_code": "92511"
				},
				{
					"id": "96",
					"provinceId": "16",
					"province": "Kalimantan Utara",
					"type": "Kabupaten",
					"name": "Bulungan (Bulongan)",
					"postal_code": "77211"
				},
				{
					"id": "97",
					"provinceId": "8",
					"province": "Jambi",
					"type": "Kabupaten",
					"name": "Bungo",
					"postal_code": "37216"
				},
				{
					"id": "98",
					"provinceId": "29",
					"province": "Sulawesi Tengah",
					"type": "Kabupaten",
					"name": "Buol",
					"postal_code": "94564"
				},
				{
					"id": "99",
					"provinceId": "19",
					"province": "Maluku",
					"type": "Kabupaten",
					"name": "Buru",
					"postal_code": "97371"
				},
				{
					"id": "100",
					"provinceId": "19",
					"province": "Maluku",
					"type": "Kabupaten",
					"name": "Buru Selatan",
					"postal_code": "97351"
				},
				{
					"id": "101",
					"provinceId": "30",
					"province": "Sulawesi Tenggara",
					"type": "Kabupaten",
					"name": "Buton",
					"postal_code": "93754"
				},
				{
					"id": "102",
					"provinceId": "30",
					"province": "Sulawesi Tenggara",
					"type": "Kabupaten",
					"name": "Buton Utara",
					"postal_code": "93745"
				},
				{
					"id": "103",
					"provinceId": "9",
					"province": "Jawa Barat",
					"type": "Kabupaten",
					"name": "Ciamis",
					"postal_code": "46211"
				},
				{
					"id": "104",
					"provinceId": "9",
					"province": "Jawa Barat",
					"type": "Kabupaten",
					"name": "Cianjur",
					"postal_code": "43217"
				},
				{
					"id": "105",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kabupaten",
					"name": "Cilacap",
					"postal_code": "53211"
				},
				{
					"id": "106",
					"provinceId": "3",
					"province": "Banten",
					"type": "Kota",
					"name": "Cilegon",
					"postal_code": "42417"
				},
				{
					"id": "107",
					"provinceId": "9",
					"province": "Jawa Barat",
					"type": "Kota",
					"name": "Cimahi",
					"postal_code": "40512"
				},
				{
					"id": "108",
					"provinceId": "9",
					"province": "Jawa Barat",
					"type": "Kabupaten",
					"name": "Cirebon",
					"postal_code": "45611"
				},
				{
					"id": "109",
					"provinceId": "9",
					"province": "Jawa Barat",
					"type": "Kota",
					"name": "Cirebon",
					"postal_code": "45116"
				},
				{
					"id": "110",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kabupaten",
					"name": "Dairi",
					"postal_code": "22211"
				},
				{
					"id": "111",
					"provinceId": "24",
					"province": "Papua",
					"type": "Kabupaten",
					"name": "Deiyai (Deliyai)",
					"postal_code": "98784"
				},
				{
					"id": "112",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kabupaten",
					"name": "Deli Serdang",
					"postal_code": "20511"
				},
				{
					"id": "113",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kabupaten",
					"name": "Demak",
					"postal_code": "59519"
				},
				{
					"id": "114",
					"provinceId": "1",
					"province": "Bali",
					"type": "Kota",
					"name": "Denpasar",
					"postal_code": "80227"
				},
				{
					"id": "115",
					"provinceId": "9",
					"province": "Jawa Barat",
					"type": "Kota",
					"name": "Depok",
					"postal_code": "16416"
				},
				{
					"id": "116",
					"provinceId": "32",
					"province": "Sumatera Barat",
					"type": "Kabupaten",
					"name": "Dharmasraya",
					"postal_code": "27612"
				},
				{
					"id": "117",
					"provinceId": "24",
					"province": "Papua",
					"type": "Kabupaten",
					"name": "Dogiyai",
					"postal_code": "98866"
				},
				{
					"id": "118",
					"provinceId": "22",
					"province": "Nusa Tenggara Barat (NTB)",
					"type": "Kabupaten",
					"name": "Dompu",
					"postal_code": "84217"
				},
				{
					"id": "119",
					"provinceId": "29",
					"province": "Sulawesi Tengah",
					"type": "Kabupaten",
					"name": "Donggala",
					"postal_code": "94341"
				},
				{
					"id": "120",
					"provinceId": "26",
					"province": "Riau",
					"type": "Kota",
					"name": "Dumai",
					"postal_code": "28811"
				},
				{
					"id": "121",
					"provinceId": "33",
					"province": "Sumatera Selatan",
					"type": "Kabupaten",
					"name": "Empat Lawang",
					"postal_code": "31811"
				},
				{
					"id": "122",
					"provinceId": "23",
					"province": "Nusa Tenggara Timur (NTT)",
					"type": "Kabupaten",
					"name": "Ende",
					"postal_code": "86351"
				},
				{
					"id": "123",
					"provinceId": "28",
					"province": "Sulawesi Selatan",
					"type": "Kabupaten",
					"name": "Enrekang",
					"postal_code": "91719"
				},
				{
					"id": "124",
					"provinceId": "25",
					"province": "Papua Barat",
					"type": "Kabupaten",
					"name": "Fakfak",
					"postal_code": "98651"
				},
				{
					"id": "125",
					"provinceId": "23",
					"province": "Nusa Tenggara Timur (NTT)",
					"type": "Kabupaten",
					"name": "Flores Timur",
					"postal_code": "86213"
				},
				{
					"id": "126",
					"provinceId": "9",
					"province": "Jawa Barat",
					"type": "Kabupaten",
					"name": "Garut",
					"postal_code": "44126"
				},
				{
					"id": "127",
					"provinceId": "21",
					"province": "Nanggroe Aceh Darussalam (NAD)",
					"type": "Kabupaten",
					"name": "Gayo Lues",
					"postal_code": "24653"
				},
				{
					"id": "128",
					"provinceId": "1",
					"province": "Bali",
					"type": "Kabupaten",
					"name": "Gianyar",
					"postal_code": "80519"
				},
				{
					"id": "129",
					"provinceId": "7",
					"province": "Gorontalo",
					"type": "Kabupaten",
					"name": "Gorontalo",
					"postal_code": "96218"
				},
				{
					"id": "130",
					"provinceId": "7",
					"province": "Gorontalo",
					"type": "Kota",
					"name": "Gorontalo",
					"postal_code": "96115"
				},
				{
					"id": "131",
					"provinceId": "7",
					"province": "Gorontalo",
					"type": "Kabupaten",
					"name": "Gorontalo Utara",
					"postal_code": "96611"
				},
				{
					"id": "132",
					"provinceId": "28",
					"province": "Sulawesi Selatan",
					"type": "Kabupaten",
					"name": "Gowa",
					"postal_code": "92111"
				},
				{
					"id": "133",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kabupaten",
					"name": "Gresik",
					"postal_code": "61115"
				},
				{
					"id": "134",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kabupaten",
					"name": "Grobogan",
					"postal_code": "58111"
				},
				{
					"id": "135",
					"provinceId": "5",
					"province": "DI Yogyakarta",
					"type": "Kabupaten",
					"name": "Gunung Kidul",
					"postal_code": "55812"
				},
				{
					"id": "136",
					"provinceId": "14",
					"province": "Kalimantan Tengah",
					"type": "Kabupaten",
					"name": "Gunung Mas",
					"postal_code": "74511"
				},
				{
					"id": "137",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kota",
					"name": "Gunungsitoli",
					"postal_code": "22813"
				},
				{
					"id": "138",
					"provinceId": "20",
					"province": "Maluku Utara",
					"type": "Kabupaten",
					"name": "Halmahera Barat",
					"postal_code": "97757"
				},
				{
					"id": "139",
					"provinceId": "20",
					"province": "Maluku Utara",
					"type": "Kabupaten",
					"name": "Halmahera Selatan",
					"postal_code": "97911"
				},
				{
					"id": "140",
					"provinceId": "20",
					"province": "Maluku Utara",
					"type": "Kabupaten",
					"name": "Halmahera Tengah",
					"postal_code": "97853"
				},
				{
					"id": "141",
					"provinceId": "20",
					"province": "Maluku Utara",
					"type": "Kabupaten",
					"name": "Halmahera Timur",
					"postal_code": "97862"
				},
				{
					"id": "142",
					"provinceId": "20",
					"province": "Maluku Utara",
					"type": "Kabupaten",
					"name": "Halmahera Utara",
					"postal_code": "97762"
				},
				{
					"id": "143",
					"provinceId": "13",
					"province": "Kalimantan Selatan",
					"type": "Kabupaten",
					"name": "Hulu Sungai Selatan",
					"postal_code": "71212"
				},
				{
					"id": "144",
					"provinceId": "13",
					"province": "Kalimantan Selatan",
					"type": "Kabupaten",
					"name": "Hulu Sungai Tengah",
					"postal_code": "71313"
				},
				{
					"id": "145",
					"provinceId": "13",
					"province": "Kalimantan Selatan",
					"type": "Kabupaten",
					"name": "Hulu Sungai Utara",
					"postal_code": "71419"
				},
				{
					"id": "146",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kabupaten",
					"name": "Humbang Hasundutan",
					"postal_code": "22457"
				},
				{
					"id": "147",
					"provinceId": "26",
					"province": "Riau",
					"type": "Kabupaten",
					"name": "Indragiri Hilir",
					"postal_code": "29212"
				},
				{
					"id": "148",
					"provinceId": "26",
					"province": "Riau",
					"type": "Kabupaten",
					"name": "Indragiri Hulu",
					"postal_code": "29319"
				},
				{
					"id": "149",
					"provinceId": "9",
					"province": "Jawa Barat",
					"type": "Kabupaten",
					"name": "Indramayu",
					"postal_code": "45214"
				},
				{
					"id": "150",
					"provinceId": "24",
					"province": "Papua",
					"type": "Kabupaten",
					"name": "Intan Jaya",
					"postal_code": "98771"
				},
				{
					"id": "151",
					"provinceId": "6",
					"province": "DKI Jakarta",
					"type": "Kota",
					"name": "Jakarta Barat",
					"postal_code": "11220"
				},
				{
					"id": "152",
					"provinceId": "6",
					"province": "DKI Jakarta",
					"type": "Kota",
					"name": "Jakarta Pusat",
					"postal_code": "10540"
				},
				{
					"id": "153",
					"provinceId": "6",
					"province": "DKI Jakarta",
					"type": "Kota",
					"name": "Jakarta Selatan",
					"postal_code": "12230"
				},
				{
					"id": "154",
					"provinceId": "6",
					"province": "DKI Jakarta",
					"type": "Kota",
					"name": "Jakarta Timur",
					"postal_code": "13330"
				},
				{
					"id": "155",
					"provinceId": "6",
					"province": "DKI Jakarta",
					"type": "Kota",
					"name": "Jakarta Utara",
					"postal_code": "14140"
				},
				{
					"id": "156",
					"provinceId": "8",
					"province": "Jambi",
					"type": "Kota",
					"name": "Jambi",
					"postal_code": "36111"
				},
				{
					"id": "157",
					"provinceId": "24",
					"province": "Papua",
					"type": "Kabupaten",
					"name": "Jayapura",
					"postal_code": "99352"
				},
				{
					"id": "158",
					"provinceId": "24",
					"province": "Papua",
					"type": "Kota",
					"name": "Jayapura",
					"postal_code": "99114"
				},
				{
					"id": "159",
					"provinceId": "24",
					"province": "Papua",
					"type": "Kabupaten",
					"name": "Jayawijaya",
					"postal_code": "99511"
				},
				{
					"id": "160",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kabupaten",
					"name": "Jember",
					"postal_code": "68113"
				},
				{
					"id": "161",
					"provinceId": "1",
					"province": "Bali",
					"type": "Kabupaten",
					"name": "Jembrana",
					"postal_code": "82251"
				},
				{
					"id": "162",
					"provinceId": "28",
					"province": "Sulawesi Selatan",
					"type": "Kabupaten",
					"name": "Jeneponto",
					"postal_code": "92319"
				},
				{
					"id": "163",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kabupaten",
					"name": "Jepara",
					"postal_code": "59419"
				},
				{
					"id": "164",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kabupaten",
					"name": "Jombang",
					"postal_code": "61415"
				},
				{
					"id": "165",
					"provinceId": "25",
					"province": "Papua Barat",
					"type": "Kabupaten",
					"name": "Kaimana",
					"postal_code": "98671"
				},
				{
					"id": "166",
					"provinceId": "26",
					"province": "Riau",
					"type": "Kabupaten",
					"name": "Kampar",
					"postal_code": "28411"
				},
				{
					"id": "167",
					"provinceId": "14",
					"province": "Kalimantan Tengah",
					"type": "Kabupaten",
					"name": "Kapuas",
					"postal_code": "73583"
				},
				{
					"id": "168",
					"provinceId": "12",
					"province": "Kalimantan Barat",
					"type": "Kabupaten",
					"name": "Kapuas Hulu",
					"postal_code": "78719"
				},
				{
					"id": "169",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kabupaten",
					"name": "Karanganyar",
					"postal_code": "57718"
				},
				{
					"id": "170",
					"provinceId": "1",
					"province": "Bali",
					"type": "Kabupaten",
					"name": "Karangasem",
					"postal_code": "80819"
				},
				{
					"id": "171",
					"provinceId": "9",
					"province": "Jawa Barat",
					"type": "Kabupaten",
					"name": "Karawang",
					"postal_code": "41311"
				},
				{
					"id": "172",
					"provinceId": "17",
					"province": "Kepulauan Riau",
					"type": "Kabupaten",
					"name": "Karimun",
					"postal_code": "29611"
				},
				{
					"id": "173",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kabupaten",
					"name": "Karo",
					"postal_code": "22119"
				},
				{
					"id": "174",
					"provinceId": "14",
					"province": "Kalimantan Tengah",
					"type": "Kabupaten",
					"name": "Katingan",
					"postal_code": "74411"
				},
				{
					"id": "175",
					"provinceId": "4",
					"province": "Bengkulu",
					"type": "Kabupaten",
					"name": "Kaur",
					"postal_code": "38911"
				},
				{
					"id": "176",
					"provinceId": "12",
					"province": "Kalimantan Barat",
					"type": "Kabupaten",
					"name": "Kayong Utara",
					"postal_code": "78852"
				},
				{
					"id": "177",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kabupaten",
					"name": "Kebumen",
					"postal_code": "54319"
				},
				{
					"id": "178",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kabupaten",
					"name": "Kediri",
					"postal_code": "64184"
				},
				{
					"id": "179",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kota",
					"name": "Kediri",
					"postal_code": "64125"
				},
				{
					"id": "180",
					"provinceId": "24",
					"province": "Papua",
					"type": "Kabupaten",
					"name": "Keerom",
					"postal_code": "99461"
				},
				{
					"id": "181",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kabupaten",
					"name": "Kendal",
					"postal_code": "51314"
				},
				{
					"id": "182",
					"provinceId": "30",
					"province": "Sulawesi Tenggara",
					"type": "Kota",
					"name": "Kendari",
					"postal_code": "93126"
				},
				{
					"id": "183",
					"provinceId": "4",
					"province": "Bengkulu",
					"type": "Kabupaten",
					"name": "Kepahiang",
					"postal_code": "39319"
				},
				{
					"id": "184",
					"provinceId": "17",
					"province": "Kepulauan Riau",
					"type": "Kabupaten",
					"name": "Kepulauan Anambas",
					"postal_code": "29991"
				},
				{
					"id": "185",
					"provinceId": "19",
					"province": "Maluku",
					"type": "Kabupaten",
					"name": "Kepulauan Aru",
					"postal_code": "97681"
				},
				{
					"id": "186",
					"provinceId": "32",
					"province": "Sumatera Barat",
					"type": "Kabupaten",
					"name": "Kepulauan Mentawai",
					"postal_code": "25771"
				},
				{
					"id": "187",
					"provinceId": "26",
					"province": "Riau",
					"type": "Kabupaten",
					"name": "Kepulauan Meranti",
					"postal_code": "28791"
				},
				{
					"id": "188",
					"provinceId": "31",
					"province": "Sulawesi Utara",
					"type": "Kabupaten",
					"name": "Kepulauan Sangihe",
					"postal_code": "95819"
				},
				{
					"id": "189",
					"provinceId": "6",
					"province": "DKI Jakarta",
					"type": "Kabupaten",
					"name": "Kepulauan Seribu",
					"postal_code": "14550"
				},
				{
					"id": "190",
					"provinceId": "31",
					"province": "Sulawesi Utara",
					"type": "Kabupaten",
					"name": "Kepulauan Siau Tagulandang Biaro (Sitaro)",
					"postal_code": "95862"
				},
				{
					"id": "191",
					"provinceId": "20",
					"province": "Maluku Utara",
					"type": "Kabupaten",
					"name": "Kepulauan Sula",
					"postal_code": "97995"
				},
				{
					"id": "192",
					"provinceId": "31",
					"province": "Sulawesi Utara",
					"type": "Kabupaten",
					"name": "Kepulauan Talaud",
					"postal_code": "95885"
				},
				{
					"id": "193",
					"provinceId": "24",
					"province": "Papua",
					"type": "Kabupaten",
					"name": "Kepulauan Yapen (Yapen Waropen)",
					"postal_code": "98211"
				},
				{
					"id": "194",
					"provinceId": "8",
					"province": "Jambi",
					"type": "Kabupaten",
					"name": "Kerinci",
					"postal_code": "37167"
				},
				{
					"id": "195",
					"provinceId": "12",
					"province": "Kalimantan Barat",
					"type": "Kabupaten",
					"name": "Ketapang",
					"postal_code": "78874"
				},
				{
					"id": "196",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kabupaten",
					"name": "Klaten",
					"postal_code": "57411"
				},
				{
					"id": "197",
					"provinceId": "1",
					"province": "Bali",
					"type": "Kabupaten",
					"name": "Klungkung",
					"postal_code": "80719"
				},
				{
					"id": "198",
					"provinceId": "30",
					"province": "Sulawesi Tenggara",
					"type": "Kabupaten",
					"name": "Kolaka",
					"postal_code": "93511"
				},
				{
					"id": "199",
					"provinceId": "30",
					"province": "Sulawesi Tenggara",
					"type": "Kabupaten",
					"name": "Kolaka Utara",
					"postal_code": "93911"
				},
				{
					"id": "200",
					"provinceId": "30",
					"province": "Sulawesi Tenggara",
					"type": "Kabupaten",
					"name": "Konawe",
					"postal_code": "93411"
				},
				{
					"id": "201",
					"provinceId": "30",
					"province": "Sulawesi Tenggara",
					"type": "Kabupaten",
					"name": "Konawe Selatan",
					"postal_code": "93811"
				},
				{
					"id": "202",
					"provinceId": "30",
					"province": "Sulawesi Tenggara",
					"type": "Kabupaten",
					"name": "Konawe Utara",
					"postal_code": "93311"
				},
				{
					"id": "203",
					"provinceId": "13",
					"province": "Kalimantan Selatan",
					"type": "Kabupaten",
					"name": "Kotabaru",
					"postal_code": "72119"
				},
				{
					"id": "204",
					"provinceId": "31",
					"province": "Sulawesi Utara",
					"type": "Kota",
					"name": "Kotamobagu",
					"postal_code": "95711"
				},
				{
					"id": "205",
					"provinceId": "14",
					"province": "Kalimantan Tengah",
					"type": "Kabupaten",
					"name": "Kotawaringin Barat",
					"postal_code": "74119"
				},
				{
					"id": "206",
					"provinceId": "14",
					"province": "Kalimantan Tengah",
					"type": "Kabupaten",
					"name": "Kotawaringin Timur",
					"postal_code": "74364"
				},
				{
					"id": "207",
					"provinceId": "26",
					"province": "Riau",
					"type": "Kabupaten",
					"name": "Kuantan Singingi",
					"postal_code": "29519"
				},
				{
					"id": "208",
					"provinceId": "12",
					"province": "Kalimantan Barat",
					"type": "Kabupaten",
					"name": "Kubu Raya",
					"postal_code": "78311"
				},
				{
					"id": "209",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kabupaten",
					"name": "Kudus",
					"postal_code": "59311"
				},
				{
					"id": "210",
					"provinceId": "5",
					"province": "DI Yogyakarta",
					"type": "Kabupaten",
					"name": "Kulon Progo",
					"postal_code": "55611"
				},
				{
					"id": "211",
					"provinceId": "9",
					"province": "Jawa Barat",
					"type": "Kabupaten",
					"name": "Kuningan",
					"postal_code": "45511"
				},
				{
					"id": "212",
					"provinceId": "23",
					"province": "Nusa Tenggara Timur (NTT)",
					"type": "Kabupaten",
					"name": "Kupang",
					"postal_code": "85362"
				},
				{
					"id": "213",
					"provinceId": "23",
					"province": "Nusa Tenggara Timur (NTT)",
					"type": "Kota",
					"name": "Kupang",
					"postal_code": "85119"
				},
				{
					"id": "214",
					"provinceId": "15",
					"province": "Kalimantan Timur",
					"type": "Kabupaten",
					"name": "Kutai Barat",
					"postal_code": "75711"
				},
				{
					"id": "215",
					"provinceId": "15",
					"province": "Kalimantan Timur",
					"type": "Kabupaten",
					"name": "Kutai Kartanegara",
					"postal_code": "75511"
				},
				{
					"id": "216",
					"provinceId": "15",
					"province": "Kalimantan Timur",
					"type": "Kabupaten",
					"name": "Kutai Timur",
					"postal_code": "75611"
				},
				{
					"id": "217",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kabupaten",
					"name": "Labuhan Batu",
					"postal_code": "21412"
				},
				{
					"id": "218",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kabupaten",
					"name": "Labuhan Batu Selatan",
					"postal_code": "21511"
				},
				{
					"id": "219",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kabupaten",
					"name": "Labuhan Batu Utara",
					"postal_code": "21711"
				},
				{
					"id": "220",
					"provinceId": "33",
					"province": "Sumatera Selatan",
					"type": "Kabupaten",
					"name": "Lahat",
					"postal_code": "31419"
				},
				{
					"id": "221",
					"provinceId": "14",
					"province": "Kalimantan Tengah",
					"type": "Kabupaten",
					"name": "Lamandau",
					"postal_code": "74611"
				},
				{
					"id": "222",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kabupaten",
					"name": "Lamongan",
					"postal_code": "64125"
				},
				{
					"id": "223",
					"provinceId": "18",
					"province": "Lampung",
					"type": "Kabupaten",
					"name": "Lampung Barat",
					"postal_code": "34814"
				},
				{
					"id": "224",
					"provinceId": "18",
					"province": "Lampung",
					"type": "Kabupaten",
					"name": "Lampung Selatan",
					"postal_code": "35511"
				},
				{
					"id": "225",
					"provinceId": "18",
					"province": "Lampung",
					"type": "Kabupaten",
					"name": "Lampung Tengah",
					"postal_code": "34212"
				},
				{
					"id": "226",
					"provinceId": "18",
					"province": "Lampung",
					"type": "Kabupaten",
					"name": "Lampung Timur",
					"postal_code": "34319"
				},
				{
					"id": "227",
					"provinceId": "18",
					"province": "Lampung",
					"type": "Kabupaten",
					"name": "Lampung Utara",
					"postal_code": "34516"
				},
				{
					"id": "228",
					"provinceId": "12",
					"province": "Kalimantan Barat",
					"type": "Kabupaten",
					"name": "Landak",
					"postal_code": "78319"
				},
				{
					"id": "229",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kabupaten",
					"name": "Langkat",
					"postal_code": "20811"
				},
				{
					"id": "230",
					"provinceId": "21",
					"province": "Nanggroe Aceh Darussalam (NAD)",
					"type": "Kota",
					"name": "Langsa",
					"postal_code": "24412"
				},
				{
					"id": "231",
					"provinceId": "24",
					"province": "Papua",
					"type": "Kabupaten",
					"name": "Lanny Jaya",
					"postal_code": "99531"
				},
				{
					"id": "232",
					"provinceId": "3",
					"province": "Banten",
					"type": "Kabupaten",
					"name": "Lebak",
					"postal_code": "42319"
				},
				{
					"id": "233",
					"provinceId": "4",
					"province": "Bengkulu",
					"type": "Kabupaten",
					"name": "Lebong",
					"postal_code": "39264"
				},
				{
					"id": "234",
					"provinceId": "23",
					"province": "Nusa Tenggara Timur (NTT)",
					"type": "Kabupaten",
					"name": "Lembata",
					"postal_code": "86611"
				},
				{
					"id": "235",
					"provinceId": "21",
					"province": "Nanggroe Aceh Darussalam (NAD)",
					"type": "Kota",
					"name": "Lhokseumawe",
					"postal_code": "24352"
				},
				{
					"id": "236",
					"provinceId": "32",
					"province": "Sumatera Barat",
					"type": "Kabupaten",
					"name": "Lima Puluh Koto/Kota",
					"postal_code": "26671"
				},
				{
					"id": "237",
					"provinceId": "17",
					"province": "Kepulauan Riau",
					"type": "Kabupaten",
					"name": "Lingga",
					"postal_code": "29811"
				},
				{
					"id": "238",
					"provinceId": "22",
					"province": "Nusa Tenggara Barat (NTB)",
					"type": "Kabupaten",
					"name": "Lombok Barat",
					"postal_code": "83311"
				},
				{
					"id": "239",
					"provinceId": "22",
					"province": "Nusa Tenggara Barat (NTB)",
					"type": "Kabupaten",
					"name": "Lombok Tengah",
					"postal_code": "83511"
				},
				{
					"id": "240",
					"provinceId": "22",
					"province": "Nusa Tenggara Barat (NTB)",
					"type": "Kabupaten",
					"name": "Lombok Timur",
					"postal_code": "83612"
				},
				{
					"id": "241",
					"provinceId": "22",
					"province": "Nusa Tenggara Barat (NTB)",
					"type": "Kabupaten",
					"name": "Lombok Utara",
					"postal_code": "83711"
				},
				{
					"id": "242",
					"provinceId": "33",
					"province": "Sumatera Selatan",
					"type": "Kota",
					"name": "Lubuk Linggau",
					"postal_code": "31614"
				},
				{
					"id": "243",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kabupaten",
					"name": "Lumajang",
					"postal_code": "67319"
				},
				{
					"id": "244",
					"provinceId": "28",
					"province": "Sulawesi Selatan",
					"type": "Kabupaten",
					"name": "Luwu",
					"postal_code": "91994"
				},
				{
					"id": "245",
					"provinceId": "28",
					"province": "Sulawesi Selatan",
					"type": "Kabupaten",
					"name": "Luwu Timur",
					"postal_code": "92981"
				},
				{
					"id": "246",
					"provinceId": "28",
					"province": "Sulawesi Selatan",
					"type": "Kabupaten",
					"name": "Luwu Utara",
					"postal_code": "92911"
				},
				{
					"id": "247",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kabupaten",
					"name": "Madiun",
					"postal_code": "63153"
				},
				{
					"id": "248",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kota",
					"name": "Madiun",
					"postal_code": "63122"
				},
				{
					"id": "249",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kabupaten",
					"name": "Magelang",
					"postal_code": "56519"
				},
				{
					"id": "250",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kota",
					"name": "Magelang",
					"postal_code": "56133"
				},
				{
					"id": "251",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kabupaten",
					"name": "Magetan",
					"postal_code": "63314"
				},
				{
					"id": "252",
					"provinceId": "9",
					"province": "Jawa Barat",
					"type": "Kabupaten",
					"name": "Majalengka",
					"postal_code": "45412"
				},
				{
					"id": "253",
					"provinceId": "27",
					"province": "Sulawesi Barat",
					"type": "Kabupaten",
					"name": "Majene",
					"postal_code": "91411"
				},
				{
					"id": "254",
					"provinceId": "28",
					"province": "Sulawesi Selatan",
					"type": "Kota",
					"name": "Makassar",
					"postal_code": "90111"
				},
				{
					"id": "255",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kabupaten",
					"name": "Malang",
					"postal_code": "65163"
				},
				{
					"id": "256",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kota",
					"name": "Malang",
					"postal_code": "65112"
				},
				{
					"id": "257",
					"provinceId": "16",
					"province": "Kalimantan Utara",
					"type": "Kabupaten",
					"name": "Malinau",
					"postal_code": "77511"
				},
				{
					"id": "258",
					"provinceId": "19",
					"province": "Maluku",
					"type": "Kabupaten",
					"name": "Maluku Barat Daya",
					"postal_code": "97451"
				},
				{
					"id": "259",
					"provinceId": "19",
					"province": "Maluku",
					"type": "Kabupaten",
					"name": "Maluku Tengah",
					"postal_code": "97513"
				},
				{
					"id": "260",
					"provinceId": "19",
					"province": "Maluku",
					"type": "Kabupaten",
					"name": "Maluku Tenggara",
					"postal_code": "97651"
				},
				{
					"id": "261",
					"provinceId": "19",
					"province": "Maluku",
					"type": "Kabupaten",
					"name": "Maluku Tenggara Barat",
					"postal_code": "97465"
				},
				{
					"id": "262",
					"provinceId": "27",
					"province": "Sulawesi Barat",
					"type": "Kabupaten",
					"name": "Mamasa",
					"postal_code": "91362"
				},
				{
					"id": "263",
					"provinceId": "24",
					"province": "Papua",
					"type": "Kabupaten",
					"name": "Mamberamo Raya",
					"postal_code": "99381"
				},
				{
					"id": "264",
					"provinceId": "24",
					"province": "Papua",
					"type": "Kabupaten",
					"name": "Mamberamo Tengah",
					"postal_code": "99553"
				},
				{
					"id": "265",
					"provinceId": "27",
					"province": "Sulawesi Barat",
					"type": "Kabupaten",
					"name": "Mamuju",
					"postal_code": "91519"
				},
				{
					"id": "266",
					"provinceId": "27",
					"province": "Sulawesi Barat",
					"type": "Kabupaten",
					"name": "Mamuju Utara",
					"postal_code": "91571"
				},
				{
					"id": "267",
					"provinceId": "31",
					"province": "Sulawesi Utara",
					"type": "Kota",
					"name": "Manado",
					"postal_code": "95247"
				},
				{
					"id": "268",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kabupaten",
					"name": "Mandailing Natal",
					"postal_code": "22916"
				},
				{
					"id": "269",
					"provinceId": "23",
					"province": "Nusa Tenggara Timur (NTT)",
					"type": "Kabupaten",
					"name": "Manggarai",
					"postal_code": "86551"
				},
				{
					"id": "270",
					"provinceId": "23",
					"province": "Nusa Tenggara Timur (NTT)",
					"type": "Kabupaten",
					"name": "Manggarai Barat",
					"postal_code": "86711"
				},
				{
					"id": "271",
					"provinceId": "23",
					"province": "Nusa Tenggara Timur (NTT)",
					"type": "Kabupaten",
					"name": "Manggarai Timur",
					"postal_code": "86811"
				},
				{
					"id": "272",
					"provinceId": "25",
					"province": "Papua Barat",
					"type": "Kabupaten",
					"name": "Manokwari",
					"postal_code": "98311"
				},
				{
					"id": "273",
					"provinceId": "25",
					"province": "Papua Barat",
					"type": "Kabupaten",
					"name": "Manokwari Selatan",
					"postal_code": "98355"
				},
				{
					"id": "274",
					"provinceId": "24",
					"province": "Papua",
					"type": "Kabupaten",
					"name": "Mappi",
					"postal_code": "99853"
				},
				{
					"id": "275",
					"provinceId": "28",
					"province": "Sulawesi Selatan",
					"type": "Kabupaten",
					"name": "Maros",
					"postal_code": "90511"
				},
				{
					"id": "276",
					"provinceId": "22",
					"province": "Nusa Tenggara Barat (NTB)",
					"type": "Kota",
					"name": "Mataram",
					"postal_code": "83131"
				},
				{
					"id": "277",
					"provinceId": "25",
					"province": "Papua Barat",
					"type": "Kabupaten",
					"name": "Maybrat",
					"postal_code": "98051"
				},
				{
					"id": "278",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kota",
					"name": "Medan",
					"postal_code": "20228"
				},
				{
					"id": "279",
					"provinceId": "12",
					"province": "Kalimantan Barat",
					"type": "Kabupaten",
					"name": "Melawi",
					"postal_code": "78619"
				},
				{
					"id": "280",
					"provinceId": "8",
					"province": "Jambi",
					"type": "Kabupaten",
					"name": "Merangin",
					"postal_code": "37319"
				},
				{
					"id": "281",
					"provinceId": "24",
					"province": "Papua",
					"type": "Kabupaten",
					"name": "Merauke",
					"postal_code": "99613"
				},
				{
					"id": "282",
					"provinceId": "18",
					"province": "Lampung",
					"type": "Kabupaten",
					"name": "Mesuji",
					"postal_code": "34911"
				},
				{
					"id": "283",
					"provinceId": "18",
					"province": "Lampung",
					"type": "Kota",
					"name": "Metro",
					"postal_code": "34111"
				},
				{
					"id": "284",
					"provinceId": "24",
					"province": "Papua",
					"type": "Kabupaten",
					"name": "Mimika",
					"postal_code": "99962"
				},
				{
					"id": "285",
					"provinceId": "31",
					"province": "Sulawesi Utara",
					"type": "Kabupaten",
					"name": "Minahasa",
					"postal_code": "95614"
				},
				{
					"id": "286",
					"provinceId": "31",
					"province": "Sulawesi Utara",
					"type": "Kabupaten",
					"name": "Minahasa Selatan",
					"postal_code": "95914"
				},
				{
					"id": "287",
					"provinceId": "31",
					"province": "Sulawesi Utara",
					"type": "Kabupaten",
					"name": "Minahasa Tenggara",
					"postal_code": "95995"
				},
				{
					"id": "288",
					"provinceId": "31",
					"province": "Sulawesi Utara",
					"type": "Kabupaten",
					"name": "Minahasa Utara",
					"postal_code": "95316"
				},
				{
					"id": "289",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kabupaten",
					"name": "Mojokerto",
					"postal_code": "61382"
				},
				{
					"id": "290",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kota",
					"name": "Mojokerto",
					"postal_code": "61316"
				},
				{
					"id": "291",
					"provinceId": "29",
					"province": "Sulawesi Tengah",
					"type": "Kabupaten",
					"name": "Morowali",
					"postal_code": "94911"
				},
				{
					"id": "292",
					"provinceId": "33",
					"province": "Sumatera Selatan",
					"type": "Kabupaten",
					"name": "Muara Enim",
					"postal_code": "31315"
				},
				{
					"id": "293",
					"provinceId": "8",
					"province": "Jambi",
					"type": "Kabupaten",
					"name": "Muaro Jambi",
					"postal_code": "36311"
				},
				{
					"id": "294",
					"provinceId": "4",
					"province": "Bengkulu",
					"type": "Kabupaten",
					"name": "Muko Muko",
					"postal_code": "38715"
				},
				{
					"id": "295",
					"provinceId": "30",
					"province": "Sulawesi Tenggara",
					"type": "Kabupaten",
					"name": "Muna",
					"postal_code": "93611"
				},
				{
					"id": "296",
					"provinceId": "14",
					"province": "Kalimantan Tengah",
					"type": "Kabupaten",
					"name": "Murung Raya",
					"postal_code": "73911"
				},
				{
					"id": "297",
					"provinceId": "33",
					"province": "Sumatera Selatan",
					"type": "Kabupaten",
					"name": "Musi Banyuasin",
					"postal_code": "30719"
				},
				{
					"id": "298",
					"provinceId": "33",
					"province": "Sumatera Selatan",
					"type": "Kabupaten",
					"name": "Musi Rawas",
					"postal_code": "31661"
				},
				{
					"id": "299",
					"provinceId": "24",
					"province": "Papua",
					"type": "Kabupaten",
					"name": "Nabire",
					"postal_code": "98816"
				},
				{
					"id": "300",
					"provinceId": "21",
					"province": "Nanggroe Aceh Darussalam (NAD)",
					"type": "Kabupaten",
					"name": "Nagan Raya",
					"postal_code": "23674"
				},
				{
					"id": "301",
					"provinceId": "23",
					"province": "Nusa Tenggara Timur (NTT)",
					"type": "Kabupaten",
					"name": "Nagekeo",
					"postal_code": "86911"
				},
				{
					"id": "302",
					"provinceId": "17",
					"province": "Kepulauan Riau",
					"type": "Kabupaten",
					"name": "Natuna",
					"postal_code": "29711"
				},
				{
					"id": "303",
					"provinceId": "24",
					"province": "Papua",
					"type": "Kabupaten",
					"name": "Nduga",
					"postal_code": "99541"
				},
				{
					"id": "304",
					"provinceId": "23",
					"province": "Nusa Tenggara Timur (NTT)",
					"type": "Kabupaten",
					"name": "Ngada",
					"postal_code": "86413"
				},
				{
					"id": "305",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kabupaten",
					"name": "Nganjuk",
					"postal_code": "64414"
				},
				{
					"id": "306",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kabupaten",
					"name": "Ngawi",
					"postal_code": "63219"
				},
				{
					"id": "307",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kabupaten",
					"name": "Nias",
					"postal_code": "22876"
				},
				{
					"id": "308",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kabupaten",
					"name": "Nias Barat",
					"postal_code": "22895"
				},
				{
					"id": "309",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kabupaten",
					"name": "Nias Selatan",
					"postal_code": "22865"
				},
				{
					"id": "310",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kabupaten",
					"name": "Nias Utara",
					"postal_code": "22856"
				},
				{
					"id": "311",
					"provinceId": "16",
					"province": "Kalimantan Utara",
					"type": "Kabupaten",
					"name": "Nunukan",
					"postal_code": "77421"
				},
				{
					"id": "312",
					"provinceId": "33",
					"province": "Sumatera Selatan",
					"type": "Kabupaten",
					"name": "Ogan Ilir",
					"postal_code": "30811"
				},
				{
					"id": "313",
					"provinceId": "33",
					"province": "Sumatera Selatan",
					"type": "Kabupaten",
					"name": "Ogan Komering Ilir",
					"postal_code": "30618"
				},
				{
					"id": "314",
					"provinceId": "33",
					"province": "Sumatera Selatan",
					"type": "Kabupaten",
					"name": "Ogan Komering Ulu",
					"postal_code": "32112"
				},
				{
					"id": "315",
					"provinceId": "33",
					"province": "Sumatera Selatan",
					"type": "Kabupaten",
					"name": "Ogan Komering Ulu Selatan",
					"postal_code": "32211"
				},
				{
					"id": "316",
					"provinceId": "33",
					"province": "Sumatera Selatan",
					"type": "Kabupaten",
					"name": "Ogan Komering Ulu Timur",
					"postal_code": "32312"
				},
				{
					"id": "317",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kabupaten",
					"name": "Pacitan",
					"postal_code": "63512"
				},
				{
					"id": "318",
					"provinceId": "32",
					"province": "Sumatera Barat",
					"type": "Kota",
					"name": "Padang",
					"postal_code": "25112"
				},
				{
					"id": "319",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kabupaten",
					"name": "Padang Lawas",
					"postal_code": "22763"
				},
				{
					"id": "320",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kabupaten",
					"name": "Padang Lawas Utara",
					"postal_code": "22753"
				},
				{
					"id": "321",
					"provinceId": "32",
					"province": "Sumatera Barat",
					"type": "Kota",
					"name": "Padang Panjang",
					"postal_code": "27122"
				},
				{
					"id": "322",
					"provinceId": "32",
					"province": "Sumatera Barat",
					"type": "Kabupaten",
					"name": "Padang Pariaman",
					"postal_code": "25583"
				},
				{
					"id": "323",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kota",
					"name": "Padang Sidempuan",
					"postal_code": "22727"
				},
				{
					"id": "324",
					"provinceId": "33",
					"province": "Sumatera Selatan",
					"type": "Kota",
					"name": "Pagar Alam",
					"postal_code": "31512"
				},
				{
					"id": "325",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kabupaten",
					"name": "Pakpak Bharat",
					"postal_code": "22272"
				},
				{
					"id": "326",
					"provinceId": "14",
					"province": "Kalimantan Tengah",
					"type": "Kota",
					"name": "Palangka Raya",
					"postal_code": "73112"
				},
				{
					"id": "327",
					"provinceId": "33",
					"province": "Sumatera Selatan",
					"type": "Kota",
					"name": "Palembang",
					"postal_code": "30111"
				},
				{
					"id": "328",
					"provinceId": "28",
					"province": "Sulawesi Selatan",
					"type": "Kota",
					"name": "Palopo",
					"postal_code": "91911"
				},
				{
					"id": "329",
					"provinceId": "29",
					"province": "Sulawesi Tengah",
					"type": "Kota",
					"name": "Palu",
					"postal_code": "94111"
				},
				{
					"id": "330",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kabupaten",
					"name": "Pamekasan",
					"postal_code": "69319"
				},
				{
					"id": "331",
					"provinceId": "3",
					"province": "Banten",
					"type": "Kabupaten",
					"name": "Pandeglang",
					"postal_code": "42212"
				},
				{
					"id": "332",
					"provinceId": "9",
					"province": "Jawa Barat",
					"type": "Kabupaten",
					"name": "Pangandaran",
					"postal_code": "46511"
				},
				{
					"id": "333",
					"provinceId": "28",
					"province": "Sulawesi Selatan",
					"type": "Kabupaten",
					"name": "Pangkajene Kepulauan",
					"postal_code": "90611"
				},
				{
					"id": "334",
					"provinceId": "2",
					"province": "Bangka Belitung",
					"type": "Kota",
					"name": "Pangkal Pinang",
					"postal_code": "33115"
				},
				{
					"id": "335",
					"provinceId": "24",
					"province": "Papua",
					"type": "Kabupaten",
					"name": "Paniai",
					"postal_code": "98765"
				},
				{
					"id": "336",
					"provinceId": "28",
					"province": "Sulawesi Selatan",
					"type": "Kota",
					"name": "Parepare",
					"postal_code": "91123"
				},
				{
					"id": "337",
					"provinceId": "32",
					"province": "Sumatera Barat",
					"type": "Kota",
					"name": "Pariaman",
					"postal_code": "25511"
				},
				{
					"id": "338",
					"provinceId": "29",
					"province": "Sulawesi Tengah",
					"type": "Kabupaten",
					"name": "Parigi Moutong",
					"postal_code": "94411"
				},
				{
					"id": "339",
					"provinceId": "32",
					"province": "Sumatera Barat",
					"type": "Kabupaten",
					"name": "Pasaman",
					"postal_code": "26318"
				},
				{
					"id": "340",
					"provinceId": "32",
					"province": "Sumatera Barat",
					"type": "Kabupaten",
					"name": "Pasaman Barat",
					"postal_code": "26511"
				},
				{
					"id": "341",
					"provinceId": "15",
					"province": "Kalimantan Timur",
					"type": "Kabupaten",
					"name": "Paser",
					"postal_code": "76211"
				},
				{
					"id": "342",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kabupaten",
					"name": "Pasuruan",
					"postal_code": "67153"
				},
				{
					"id": "343",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kota",
					"name": "Pasuruan",
					"postal_code": "67118"
				},
				{
					"id": "344",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kabupaten",
					"name": "Pati",
					"postal_code": "59114"
				},
				{
					"id": "345",
					"provinceId": "32",
					"province": "Sumatera Barat",
					"type": "Kota",
					"name": "Payakumbuh",
					"postal_code": "26213"
				},
				{
					"id": "346",
					"provinceId": "25",
					"province": "Papua Barat",
					"type": "Kabupaten",
					"name": "Pegunungan Arfak",
					"postal_code": "98354"
				},
				{
					"id": "347",
					"provinceId": "24",
					"province": "Papua",
					"type": "Kabupaten",
					"name": "Pegunungan Bintang",
					"postal_code": "99573"
				},
				{
					"id": "348",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kabupaten",
					"name": "Pekalongan",
					"postal_code": "51161"
				},
				{
					"id": "349",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kota",
					"name": "Pekalongan",
					"postal_code": "51122"
				},
				{
					"id": "350",
					"provinceId": "26",
					"province": "Riau",
					"type": "Kota",
					"name": "Pekanbaru",
					"postal_code": "28112"
				},
				{
					"id": "351",
					"provinceId": "26",
					"province": "Riau",
					"type": "Kabupaten",
					"name": "Pelalawan",
					"postal_code": "28311"
				},
				{
					"id": "352",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kabupaten",
					"name": "Pemalang",
					"postal_code": "52319"
				},
				{
					"id": "353",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kota",
					"name": "Pematang Siantar",
					"postal_code": "21126"
				},
				{
					"id": "354",
					"provinceId": "15",
					"province": "Kalimantan Timur",
					"type": "Kabupaten",
					"name": "Penajam Paser Utara",
					"postal_code": "76311"
				},
				{
					"id": "355",
					"provinceId": "18",
					"province": "Lampung",
					"type": "Kabupaten",
					"name": "Pesawaran",
					"postal_code": "35312"
				},
				{
					"id": "356",
					"provinceId": "18",
					"province": "Lampung",
					"type": "Kabupaten",
					"name": "Pesisir Barat",
					"postal_code": "35974"
				},
				{
					"id": "357",
					"provinceId": "32",
					"province": "Sumatera Barat",
					"type": "Kabupaten",
					"name": "Pesisir Selatan",
					"postal_code": "25611"
				},
				{
					"id": "358",
					"provinceId": "21",
					"province": "Nanggroe Aceh Darussalam (NAD)",
					"type": "Kabupaten",
					"name": "Pidie",
					"postal_code": "24116"
				},
				{
					"id": "359",
					"provinceId": "21",
					"province": "Nanggroe Aceh Darussalam (NAD)",
					"type": "Kabupaten",
					"name": "Pidie Jaya",
					"postal_code": "24186"
				},
				{
					"id": "360",
					"provinceId": "28",
					"province": "Sulawesi Selatan",
					"type": "Kabupaten",
					"name": "Pinrang",
					"postal_code": "91251"
				},
				{
					"id": "361",
					"provinceId": "7",
					"province": "Gorontalo",
					"type": "Kabupaten",
					"name": "Pohuwato",
					"postal_code": "96419"
				},
				{
					"id": "362",
					"provinceId": "27",
					"province": "Sulawesi Barat",
					"type": "Kabupaten",
					"name": "Polewali Mandar",
					"postal_code": "91311"
				},
				{
					"id": "363",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kabupaten",
					"name": "Ponorogo",
					"postal_code": "63411"
				},
				{
					"id": "364",
					"provinceId": "12",
					"province": "Kalimantan Barat",
					"type": "Kabupaten",
					"name": "Pontianak",
					"postal_code": "78971"
				},
				{
					"id": "365",
					"provinceId": "12",
					"province": "Kalimantan Barat",
					"type": "Kota",
					"name": "Pontianak",
					"postal_code": "78112"
				},
				{
					"id": "366",
					"provinceId": "29",
					"province": "Sulawesi Tengah",
					"type": "Kabupaten",
					"name": "Poso",
					"postal_code": "94615"
				},
				{
					"id": "367",
					"provinceId": "33",
					"province": "Sumatera Selatan",
					"type": "Kota",
					"name": "Prabumulih",
					"postal_code": "31121"
				},
				{
					"id": "368",
					"provinceId": "18",
					"province": "Lampung",
					"type": "Kabupaten",
					"name": "Pringsewu",
					"postal_code": "35719"
				},
				{
					"id": "369",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kabupaten",
					"name": "Probolinggo",
					"postal_code": "67282"
				},
				{
					"id": "370",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kota",
					"name": "Probolinggo",
					"postal_code": "67215"
				},
				{
					"id": "371",
					"provinceId": "14",
					"province": "Kalimantan Tengah",
					"type": "Kabupaten",
					"name": "Pulang Pisau",
					"postal_code": "74811"
				},
				{
					"id": "372",
					"provinceId": "20",
					"province": "Maluku Utara",
					"type": "Kabupaten",
					"name": "Pulau Morotai",
					"postal_code": "97771"
				},
				{
					"id": "373",
					"provinceId": "24",
					"province": "Papua",
					"type": "Kabupaten",
					"name": "Puncak",
					"postal_code": "98981"
				},
				{
					"id": "374",
					"provinceId": "24",
					"province": "Papua",
					"type": "Kabupaten",
					"name": "Puncak Jaya",
					"postal_code": "98979"
				},
				{
					"id": "375",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kabupaten",
					"name": "Purbalingga",
					"postal_code": "53312"
				},
				{
					"id": "376",
					"provinceId": "9",
					"province": "Jawa Barat",
					"type": "Kabupaten",
					"name": "Purwakarta",
					"postal_code": "41119"
				},
				{
					"id": "377",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kabupaten",
					"name": "Purworejo",
					"postal_code": "54111"
				},
				{
					"id": "378",
					"provinceId": "25",
					"province": "Papua Barat",
					"type": "Kabupaten",
					"name": "Raja Ampat",
					"postal_code": "98489"
				},
				{
					"id": "379",
					"provinceId": "4",
					"province": "Bengkulu",
					"type": "Kabupaten",
					"name": "Rejang Lebong",
					"postal_code": "39112"
				},
				{
					"id": "380",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kabupaten",
					"name": "Rembang",
					"postal_code": "59219"
				},
				{
					"id": "381",
					"provinceId": "26",
					"province": "Riau",
					"type": "Kabupaten",
					"name": "Rokan Hilir",
					"postal_code": "28992"
				},
				{
					"id": "382",
					"provinceId": "26",
					"province": "Riau",
					"type": "Kabupaten",
					"name": "Rokan Hulu",
					"postal_code": "28511"
				},
				{
					"id": "383",
					"provinceId": "23",
					"province": "Nusa Tenggara Timur (NTT)",
					"type": "Kabupaten",
					"name": "Rote Ndao",
					"postal_code": "85982"
				},
				{
					"id": "384",
					"provinceId": "21",
					"province": "Nanggroe Aceh Darussalam (NAD)",
					"type": "Kota",
					"name": "Sabang",
					"postal_code": "23512"
				},
				{
					"id": "385",
					"provinceId": "23",
					"province": "Nusa Tenggara Timur (NTT)",
					"type": "Kabupaten",
					"name": "Sabu Raijua",
					"postal_code": "85391"
				},
				{
					"id": "386",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kota",
					"name": "Salatiga",
					"postal_code": "50711"
				},
				{
					"id": "387",
					"provinceId": "15",
					"province": "Kalimantan Timur",
					"type": "Kota",
					"name": "Samarinda",
					"postal_code": "75133"
				},
				{
					"id": "388",
					"provinceId": "12",
					"province": "Kalimantan Barat",
					"type": "Kabupaten",
					"name": "Sambas",
					"postal_code": "79453"
				},
				{
					"id": "389",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kabupaten",
					"name": "Samosir",
					"postal_code": "22392"
				},
				{
					"id": "390",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kabupaten",
					"name": "Sampang",
					"postal_code": "69219"
				},
				{
					"id": "391",
					"provinceId": "12",
					"province": "Kalimantan Barat",
					"type": "Kabupaten",
					"name": "Sanggau",
					"postal_code": "78557"
				},
				{
					"id": "392",
					"provinceId": "24",
					"province": "Papua",
					"type": "Kabupaten",
					"name": "Sarmi",
					"postal_code": "99373"
				},
				{
					"id": "393",
					"provinceId": "8",
					"province": "Jambi",
					"type": "Kabupaten",
					"name": "Sarolangun",
					"postal_code": "37419"
				},
				{
					"id": "394",
					"provinceId": "32",
					"province": "Sumatera Barat",
					"type": "Kota",
					"name": "Sawah Lunto",
					"postal_code": "27416"
				},
				{
					"id": "395",
					"provinceId": "12",
					"province": "Kalimantan Barat",
					"type": "Kabupaten",
					"name": "Sekadau",
					"postal_code": "79583"
				},
				{
					"id": "396",
					"provinceId": "28",
					"province": "Sulawesi Selatan",
					"type": "Kabupaten",
					"name": "Selayar (Kepulauan Selayar)",
					"postal_code": "92812"
				},
				{
					"id": "397",
					"provinceId": "4",
					"province": "Bengkulu",
					"type": "Kabupaten",
					"name": "Seluma",
					"postal_code": "38811"
				},
				{
					"id": "398",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kabupaten",
					"name": "Semarang",
					"postal_code": "50511"
				},
				{
					"id": "399",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kota",
					"name": "Semarang",
					"postal_code": "50135"
				},
				{
					"id": "400",
					"provinceId": "19",
					"province": "Maluku",
					"type": "Kabupaten",
					"name": "Seram Bagian Barat",
					"postal_code": "97561"
				},
				{
					"id": "401",
					"provinceId": "19",
					"province": "Maluku",
					"type": "Kabupaten",
					"name": "Seram Bagian Timur",
					"postal_code": "97581"
				},
				{
					"id": "402",
					"provinceId": "3",
					"province": "Banten",
					"type": "Kabupaten",
					"name": "Serang",
					"postal_code": "42182"
				},
				{
					"id": "403",
					"provinceId": "3",
					"province": "Banten",
					"type": "Kota",
					"name": "Serang",
					"postal_code": "42111"
				},
				{
					"id": "404",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kabupaten",
					"name": "Serdang Bedagai",
					"postal_code": "20915"
				},
				{
					"id": "405",
					"provinceId": "14",
					"province": "Kalimantan Tengah",
					"type": "Kabupaten",
					"name": "Seruyan",
					"postal_code": "74211"
				},
				{
					"id": "406",
					"provinceId": "26",
					"province": "Riau",
					"type": "Kabupaten",
					"name": "Siak",
					"postal_code": "28623"
				},
				{
					"id": "407",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kota",
					"name": "Sibolga",
					"postal_code": "22522"
				},
				{
					"id": "408",
					"provinceId": "28",
					"province": "Sulawesi Selatan",
					"type": "Kabupaten",
					"name": "Sidenreng Rappang/Rapang",
					"postal_code": "91613"
				},
				{
					"id": "409",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kabupaten",
					"name": "Sidoarjo",
					"postal_code": "61219"
				},
				{
					"id": "410",
					"provinceId": "29",
					"province": "Sulawesi Tengah",
					"type": "Kabupaten",
					"name": "Sigi",
					"postal_code": "94364"
				},
				{
					"id": "411",
					"provinceId": "32",
					"province": "Sumatera Barat",
					"type": "Kabupaten",
					"name": "Sijunjung (Sawah Lunto Sijunjung)",
					"postal_code": "27511"
				},
				{
					"id": "412",
					"provinceId": "23",
					"province": "Nusa Tenggara Timur (NTT)",
					"type": "Kabupaten",
					"name": "Sikka",
					"postal_code": "86121"
				},
				{
					"id": "413",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kabupaten",
					"name": "Simalungun",
					"postal_code": "21162"
				},
				{
					"id": "414",
					"provinceId": "21",
					"province": "Nanggroe Aceh Darussalam (NAD)",
					"type": "Kabupaten",
					"name": "Simeulue",
					"postal_code": "23891"
				},
				{
					"id": "415",
					"provinceId": "12",
					"province": "Kalimantan Barat",
					"type": "Kota",
					"name": "Singkawang",
					"postal_code": "79117"
				},
				{
					"id": "416",
					"provinceId": "28",
					"province": "Sulawesi Selatan",
					"type": "Kabupaten",
					"name": "Sinjai",
					"postal_code": "92615"
				},
				{
					"id": "417",
					"provinceId": "12",
					"province": "Kalimantan Barat",
					"type": "Kabupaten",
					"name": "Sintang",
					"postal_code": "78619"
				},
				{
					"id": "418",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kabupaten",
					"name": "Situbondo",
					"postal_code": "68316"
				},
				{
					"id": "419",
					"provinceId": "5",
					"province": "DI Yogyakarta",
					"type": "Kabupaten",
					"name": "Sleman",
					"postal_code": "55513"
				},
				{
					"id": "420",
					"provinceId": "32",
					"province": "Sumatera Barat",
					"type": "Kabupaten",
					"name": "Solok",
					"postal_code": "27365"
				},
				{
					"id": "421",
					"provinceId": "32",
					"province": "Sumatera Barat",
					"type": "Kota",
					"name": "Solok",
					"postal_code": "27315"
				},
				{
					"id": "422",
					"provinceId": "32",
					"province": "Sumatera Barat",
					"type": "Kabupaten",
					"name": "Solok Selatan",
					"postal_code": "27779"
				},
				{
					"id": "423",
					"provinceId": "28",
					"province": "Sulawesi Selatan",
					"type": "Kabupaten",
					"name": "Soppeng",
					"postal_code": "90812"
				},
				{
					"id": "424",
					"provinceId": "25",
					"province": "Papua Barat",
					"type": "Kabupaten",
					"name": "Sorong",
					"postal_code": "98431"
				},
				{
					"id": "425",
					"provinceId": "25",
					"province": "Papua Barat",
					"type": "Kota",
					"name": "Sorong",
					"postal_code": "98411"
				},
				{
					"id": "426",
					"provinceId": "25",
					"province": "Papua Barat",
					"type": "Kabupaten",
					"name": "Sorong Selatan",
					"postal_code": "98454"
				},
				{
					"id": "427",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kabupaten",
					"name": "Sragen",
					"postal_code": "57211"
				},
				{
					"id": "428",
					"provinceId": "9",
					"province": "Jawa Barat",
					"type": "Kabupaten",
					"name": "Subang",
					"postal_code": "41215"
				},
				{
					"id": "429",
					"provinceId": "21",
					"province": "Nanggroe Aceh Darussalam (NAD)",
					"type": "Kota",
					"name": "Subulussalam",
					"postal_code": "24882"
				},
				{
					"id": "430",
					"provinceId": "9",
					"province": "Jawa Barat",
					"type": "Kabupaten",
					"name": "Sukabumi",
					"postal_code": "43311"
				},
				{
					"id": "431",
					"provinceId": "9",
					"province": "Jawa Barat",
					"type": "Kota",
					"name": "Sukabumi",
					"postal_code": "43114"
				},
				{
					"id": "432",
					"provinceId": "14",
					"province": "Kalimantan Tengah",
					"type": "Kabupaten",
					"name": "Sukamara",
					"postal_code": "74712"
				},
				{
					"id": "433",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kabupaten",
					"name": "Sukoharjo",
					"postal_code": "57514"
				},
				{
					"id": "434",
					"provinceId": "23",
					"province": "Nusa Tenggara Timur (NTT)",
					"type": "Kabupaten",
					"name": "Sumba Barat",
					"postal_code": "87219"
				},
				{
					"id": "435",
					"provinceId": "23",
					"province": "Nusa Tenggara Timur (NTT)",
					"type": "Kabupaten",
					"name": "Sumba Barat Daya",
					"postal_code": "87453"
				},
				{
					"id": "436",
					"provinceId": "23",
					"province": "Nusa Tenggara Timur (NTT)",
					"type": "Kabupaten",
					"name": "Sumba Tengah",
					"postal_code": "87358"
				},
				{
					"id": "437",
					"provinceId": "23",
					"province": "Nusa Tenggara Timur (NTT)",
					"type": "Kabupaten",
					"name": "Sumba Timur",
					"postal_code": "87112"
				},
				{
					"id": "438",
					"provinceId": "22",
					"province": "Nusa Tenggara Barat (NTB)",
					"type": "Kabupaten",
					"name": "Sumbawa",
					"postal_code": "84315"
				},
				{
					"id": "439",
					"provinceId": "22",
					"province": "Nusa Tenggara Barat (NTB)",
					"type": "Kabupaten",
					"name": "Sumbawa Barat",
					"postal_code": "84419"
				},
				{
					"id": "440",
					"provinceId": "9",
					"province": "Jawa Barat",
					"type": "Kabupaten",
					"name": "Sumedang",
					"postal_code": "45326"
				},
				{
					"id": "441",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kabupaten",
					"name": "Sumenep",
					"postal_code": "69413"
				},
				{
					"id": "442",
					"provinceId": "8",
					"province": "Jambi",
					"type": "Kota",
					"name": "Sungaipenuh",
					"postal_code": "37113"
				},
				{
					"id": "443",
					"provinceId": "24",
					"province": "Papua",
					"type": "Kabupaten",
					"name": "Supiori",
					"postal_code": "98164"
				},
				{
					"id": "444",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kota",
					"name": "Surabaya",
					"postal_code": "60119"
				},
				{
					"id": "445",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kota",
					"name": "Surakarta (Solo)",
					"postal_code": "57113"
				},
				{
					"id": "446",
					"provinceId": "13",
					"province": "Kalimantan Selatan",
					"type": "Kabupaten",
					"name": "Tabalong",
					"postal_code": "71513"
				},
				{
					"id": "447",
					"provinceId": "1",
					"province": "Bali",
					"type": "Kabupaten",
					"name": "Tabanan",
					"postal_code": "82119"
				},
				{
					"id": "448",
					"provinceId": "28",
					"province": "Sulawesi Selatan",
					"type": "Kabupaten",
					"name": "Takalar",
					"postal_code": "92212"
				},
				{
					"id": "449",
					"provinceId": "25",
					"province": "Papua Barat",
					"type": "Kabupaten",
					"name": "Tambrauw",
					"postal_code": "98475"
				},
				{
					"id": "450",
					"provinceId": "16",
					"province": "Kalimantan Utara",
					"type": "Kabupaten",
					"name": "Tana Tidung",
					"postal_code": "77611"
				},
				{
					"id": "451",
					"provinceId": "28",
					"province": "Sulawesi Selatan",
					"type": "Kabupaten",
					"name": "Tana Toraja",
					"postal_code": "91819"
				},
				{
					"id": "452",
					"provinceId": "13",
					"province": "Kalimantan Selatan",
					"type": "Kabupaten",
					"name": "Tanah Bumbu",
					"postal_code": "72211"
				},
				{
					"id": "453",
					"provinceId": "32",
					"province": "Sumatera Barat",
					"type": "Kabupaten",
					"name": "Tanah Datar",
					"postal_code": "27211"
				},
				{
					"id": "454",
					"provinceId": "13",
					"province": "Kalimantan Selatan",
					"type": "Kabupaten",
					"name": "Tanah Laut",
					"postal_code": "70811"
				},
				{
					"id": "455",
					"provinceId": "3",
					"province": "Banten",
					"type": "Kabupaten",
					"name": "Tangerang",
					"postal_code": "15914"
				},
				{
					"id": "456",
					"provinceId": "3",
					"province": "Banten",
					"type": "Kota",
					"name": "Tangerang",
					"postal_code": "15111"
				},
				{
					"id": "457",
					"provinceId": "3",
					"province": "Banten",
					"type": "Kota",
					"name": "Tangerang Selatan",
					"postal_code": "15435"
				},
				{
					"id": "458",
					"provinceId": "18",
					"province": "Lampung",
					"type": "Kabupaten",
					"name": "Tanggamus",
					"postal_code": "35619"
				},
				{
					"id": "459",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kota",
					"name": "Tanjung Balai",
					"postal_code": "21321"
				},
				{
					"id": "460",
					"provinceId": "8",
					"province": "Jambi",
					"type": "Kabupaten",
					"name": "Tanjung Jabung Barat",
					"postal_code": "36513"
				},
				{
					"id": "461",
					"provinceId": "8",
					"province": "Jambi",
					"type": "Kabupaten",
					"name": "Tanjung Jabung Timur",
					"postal_code": "36719"
				},
				{
					"id": "462",
					"provinceId": "17",
					"province": "Kepulauan Riau",
					"type": "Kota",
					"name": "Tanjung Pinang",
					"postal_code": "29111"
				},
				{
					"id": "463",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kabupaten",
					"name": "Tapanuli Selatan",
					"postal_code": "22742"
				},
				{
					"id": "464",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kabupaten",
					"name": "Tapanuli Tengah",
					"postal_code": "22611"
				},
				{
					"id": "465",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kabupaten",
					"name": "Tapanuli Utara",
					"postal_code": "22414"
				},
				{
					"id": "466",
					"provinceId": "13",
					"province": "Kalimantan Selatan",
					"type": "Kabupaten",
					"name": "Tapin",
					"postal_code": "71119"
				},
				{
					"id": "467",
					"provinceId": "16",
					"province": "Kalimantan Utara",
					"type": "Kota",
					"name": "Tarakan",
					"postal_code": "77114"
				},
				{
					"id": "468",
					"provinceId": "9",
					"province": "Jawa Barat",
					"type": "Kabupaten",
					"name": "Tasikmalaya",
					"postal_code": "46411"
				},
				{
					"id": "469",
					"provinceId": "9",
					"province": "Jawa Barat",
					"type": "Kota",
					"name": "Tasikmalaya",
					"postal_code": "46116"
				},
				{
					"id": "470",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kota",
					"name": "Tebing Tinggi",
					"postal_code": "20632"
				},
				{
					"id": "471",
					"provinceId": "8",
					"province": "Jambi",
					"type": "Kabupaten",
					"name": "Tebo",
					"postal_code": "37519"
				},
				{
					"id": "472",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kabupaten",
					"name": "Tegal",
					"postal_code": "52419"
				},
				{
					"id": "473",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kota",
					"name": "Tegal",
					"postal_code": "52114"
				},
				{
					"id": "474",
					"provinceId": "25",
					"province": "Papua Barat",
					"type": "Kabupaten",
					"name": "Teluk Bintuni",
					"postal_code": "98551"
				},
				{
					"id": "475",
					"provinceId": "25",
					"province": "Papua Barat",
					"type": "Kabupaten",
					"name": "Teluk Wondama",
					"postal_code": "98591"
				},
				{
					"id": "476",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kabupaten",
					"name": "Temanggung",
					"postal_code": "56212"
				},
				{
					"id": "477",
					"provinceId": "20",
					"province": "Maluku Utara",
					"type": "Kota",
					"name": "Ternate",
					"postal_code": "97714"
				},
				{
					"id": "478",
					"provinceId": "20",
					"province": "Maluku Utara",
					"type": "Kota",
					"name": "Tidore Kepulauan",
					"postal_code": "97815"
				},
				{
					"id": "479",
					"provinceId": "23",
					"province": "Nusa Tenggara Timur (NTT)",
					"type": "Kabupaten",
					"name": "Timor Tengah Selatan",
					"postal_code": "85562"
				},
				{
					"id": "480",
					"provinceId": "23",
					"province": "Nusa Tenggara Timur (NTT)",
					"type": "Kabupaten",
					"name": "Timor Tengah Utara",
					"postal_code": "85612"
				},
				{
					"id": "481",
					"provinceId": "34",
					"province": "Sumatera Utara",
					"type": "Kabupaten",
					"name": "Toba Samosir",
					"postal_code": "22316"
				},
				{
					"id": "482",
					"provinceId": "29",
					"province": "Sulawesi Tengah",
					"type": "Kabupaten",
					"name": "Tojo Una-Una",
					"postal_code": "94683"
				},
				{
					"id": "483",
					"provinceId": "29",
					"province": "Sulawesi Tengah",
					"type": "Kabupaten",
					"name": "Toli-Toli",
					"postal_code": "94542"
				},
				{
					"id": "484",
					"provinceId": "24",
					"province": "Papua",
					"type": "Kabupaten",
					"name": "Tolikara",
					"postal_code": "99411"
				},
				{
					"id": "485",
					"provinceId": "31",
					"province": "Sulawesi Utara",
					"type": "Kota",
					"name": "Tomohon",
					"postal_code": "95416"
				},
				{
					"id": "486",
					"provinceId": "28",
					"province": "Sulawesi Selatan",
					"type": "Kabupaten",
					"name": "Toraja Utara",
					"postal_code": "91831"
				},
				{
					"id": "487",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kabupaten",
					"name": "Trenggalek",
					"postal_code": "66312"
				},
				{
					"id": "488",
					"provinceId": "19",
					"province": "Maluku",
					"type": "Kota",
					"name": "Tual",
					"postal_code": "97612"
				},
				{
					"id": "489",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kabupaten",
					"name": "Tuban",
					"postal_code": "62319"
				},
				{
					"id": "490",
					"provinceId": "18",
					"province": "Lampung",
					"type": "Kabupaten",
					"name": "Tulang Bawang",
					"postal_code": "34613"
				},
				{
					"id": "491",
					"provinceId": "18",
					"province": "Lampung",
					"type": "Kabupaten",
					"name": "Tulang Bawang Barat",
					"postal_code": "34419"
				},
				{
					"id": "492",
					"provinceId": "11",
					"province": "Jawa Timur",
					"type": "Kabupaten",
					"name": "Tulungagung",
					"postal_code": "66212"
				},
				{
					"id": "493",
					"provinceId": "28",
					"province": "Sulawesi Selatan",
					"type": "Kabupaten",
					"name": "Wajo",
					"postal_code": "90911"
				},
				{
					"id": "494",
					"provinceId": "30",
					"province": "Sulawesi Tenggara",
					"type": "Kabupaten",
					"name": "Wakatobi",
					"postal_code": "93791"
				},
				{
					"id": "495",
					"provinceId": "24",
					"province": "Papua",
					"type": "Kabupaten",
					"name": "Waropen",
					"postal_code": "98269"
				},
				{
					"id": "496",
					"provinceId": "18",
					"province": "Lampung",
					"type": "Kabupaten",
					"name": "Way Kanan",
					"postal_code": "34711"
				},
				{
					"id": "497",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kabupaten",
					"name": "Wonogiri",
					"postal_code": "57619"
				},
				{
					"id": "498",
					"provinceId": "10",
					"province": "Jawa Tengah",
					"type": "Kabupaten",
					"name": "Wonosobo",
					"postal_code": "56311"
				},
				{
					"id": "499",
					"provinceId": "24",
					"province": "Papua",
					"type": "Kabupaten",
					"name": "Yahukimo",
					"postal_code": "99041"
				},
				{
					"id": "500",
					"provinceId": "24",
					"province": "Papua",
					"type": "Kabupaten",
					"name": "Yalimo",
					"postal_code": "99481"
				},
				{
					"id": "501",
					"provinceId": "5",
					"province": "DI Yogyakarta",
					"type": "Kota",
					"name": "Yogyakarta",
					"postal_code": "55111"
				}
			]
		);
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
	}
};
