
import moment from 'moment';
import React, { lazy } from 'react';
export const fileFormat = (url = "") => {
    const fileExtention = url.split(".").pop()

    if (fileExtention === "mp4" || fileExtention === "ogg" || fileExtention === "webm" || fileExtention === "mpg" || fileExtention === "mpeg") {
        return "video";
    }
    if (fileExtention === "mp3" || fileExtention === "wav") {
        return "audio"
    }
    if (fileExtention === "jpg" || fileExtention === "png" || fileExtention === "gif" || fileExtention === "bmp") {
        return "image";
    }
    return "file";
}
export const transformImage = (url, width = 100) => {
    const newUrl = url.replace("upload/", `upload/dpr_auto/w_${width}/`);
    return newUrl;
}
export const getLast7Days = () => {
    const currentDate = moment()
    const last7Days = [];
    for (let i = 0; i <= 6; i++) {
        const dayDate = currentDate.clone().subtract(i, 'days');
        const dayName = dayDate.format('dddd');
        last7Days.unshift(dayName);
    }
    return last7Days;
}

export const getOrSaveFromStorage=({key, value, get})=>{
    if(get) return localStorage.getItem(key)?JSON.parse(localStorage.getItem(key)): null;
    else localStorage.setItem(key, JSON.stringify(value))
}
