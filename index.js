"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var axios_1 = require("axios");
var fs = require("fs");
var axiosInstance = axios_1["default"].create({});
/**
 * Configuration file for data collecting
 */
var EventContext = {
    base: 'https://www.serbia.travel/',
    origin: 'https://www.serbia.travel/kalendar',
    headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept-Encoding': "gzip, deflate, br",
        'Accept-Language': 'en,en-GB;q=0.9,en-US;q=0.8,sr;q=0.7,bs;q=0.6,hr;q=0.5',
        'Origin': 'https://www.serbia.travel',
        'Referer': 'https://www.serbia.travel/kalendar',
        'Cookie': 'alreadyvisited=1'
    },
    /**
     * Fake API data
     */
    body: {
        json: 1,
        perpage: 30,
        datestart: "",
        dateend: "",
        month: "",
        city: "Сви градови",
        category: "Све"
    },
    transformationLayer: {
        'TO-DATA-SET-1': {
            title: '',
            category: '',
            photo: "https://www.serbia.travel",
            eventDate: '',
            timestamp: new Date(),
            realEventDate: {
                from: '',
                to: ''
            },
            place: 'Панчево',
            contact: '',
            intro: '',
            intro2: '',
            introExpanded: '',
            // custom keys
            coordinates: {
                x: '',
                y: ''
            },
            eventInfoExtended: {
                images: [""],
                place: "",
                city: "",
                mails: [""],
                phone: ["+381 (0)31 865 370"],
                description: [""],
                externalUrls: []
            }
        }
    }
};
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var AllManifestationArray, numberOfItemsAccumulator, NUMBER_OF_MONTH, categories, eventList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // script need to scrape data
                console.log("***Sending requests to collect the data from: ".concat(EventContext.origin));
                AllManifestationArray = new Map();
                numberOfItemsAccumulator = 0;
                NUMBER_OF_MONTH = 1;
                categories = {};
                return [4 /*yield*/, getManifestationData()];
            case 1:
                eventList = _a.sent();
                console.log("***consuming for month!!!");
                eventList.data.items.forEach(function (eventItem) {
                    categories[eventItem.category] = eventItem.category;
                    // custom 
                    var newItem = transformer({
                        photo: EventContext.base + eventItem.photo
                    }, EventContext.transformationLayer['TO-DATA-SET-1'], eventItem);
                    // add value to the specific dataset
                    AllManifestationArray.set(eventItem.title, newItem);
                });
                numberOfItemsAccumulator += eventList.data.items.length;
                // map data to extended structure 
                console.log(AllManifestationArray);
                // write file to use the parsed data
                fs.writeFileSync('manifestations.json', JSON.stringify({
                    platform: {
                        categories: __assign({}, categories
                        //    "Cultural and traditional manifestations" : "Културне и традиционалне манифестације",
                        )
                    },
                    manifestations: AllManifestationArray
                }, replacer));
                console.log("Items collected: ", numberOfItemsAccumulator);
                console.log("Executed");
                return [2 /*return*/];
        }
    });
}); })();
function getManifestationData() {
    return new Promise(function (resolve, reject) {
        var options = {
            method: 'POST',
            url: EventContext.origin,
            headers: EventContext.headers,
            data: EventContext.body
        };
        axiosInstance.request(__assign({}, options)).then(function (result) {
            resolve(result);
        })["catch"](function (error) {
            reject(error);
        });
    });
}
/**
 *
 * @param templateObject - object which contain key of structure
 * @param actualData - actual data keys
 * @returns
 */
function transformer(patch, templateObject, actualData) {
    return __assign(__assign(__assign({}, templateObject), actualData), patch);
}
function replacer(key, value) {
    if (value instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(value.entries())
        };
    }
    else {
        return value;
    }
}
