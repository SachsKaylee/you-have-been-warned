const discord = require("discord.js");
const commands = require(".");
const userUtil = require("../util/user");
const roleUtil = require("../util/role");
const config = require("../config.json");
const request = require("request");
const cheerio = require("cheerio");

/**
 * This command.
 */
const command = "pornimage";

/**
 * Flattens an array in an array
 * Thanks to @Patrick Sachs
 * @param {*} arr 
 */
const flat = arr => arr.reduce((acc, val) => acc.concat(val), []);

/**
 * Handles the given command.
 * @param msg
 * @param bot
 * @returns {Promise<void>}
 */
const handle = async (msg, bot) => {
    //Check for permissions
    if (!userUtil.hasPermissionPornImages(msg.member)) {
        await msg.delete();
        return;
    }

    //Variables
    let websiteCollection = config.pornImages;
    let annotation = [];
    let userIDs = ``;
    // Parse command.
    const message = msg.content;
    let messageSplit = message.split(" ");
    if (messageSplit.length >= 2) {
        for (let i = 1; i < messageSplit.length; i++){
            annotation.push(messageSplit[i]);
        }
    }
    //check that all given users exist
    annotation.forEach((annote, index) => {
        const user = bot.users.get(userUtil.parseUser(annote));
        const member = user && msg.guild.members.get(user.id);
        if (!user || !member) {
            msg.reply("Could not find user: " + annote);
        }
        else {
            userIDs += `<@${user.id}> `;
        }
    });
    //Scrape for some images
    //Choose a set of X Links to crawl from
    //Generate X random numbers between 0 and config.pornSitesToCrawl
    let randomNumbers = [];
    for (let randNumb = 0; randNumb < config.pornSitesToCrawl; randNumb++){
        randomNumbers.push(Math.floor(Math.random() * (config.pornImages.length - 0) + 0));
    }
    //Get the urls matching the numbers
    let choosenWebsites = [];
    for (let i = 0; i < randomNumbers.length; i++){
        choosenWebsites.push(websiteCollection[randomNumbers[i]]);
    }
    //collect all images from the given websites
    const allImagesPromises = choosenWebsites.map(website => getSomeImages(website,msg));
    let imageCollection = await Promise.all(allImagesPromises);
    //choose one image from all we've got
    let randForImg = Math.floor(Math.random() * (imageCollection.length - 0) + 0);
    imageCollection = flat(imageCollection);
    const finalImage = imageCollection[randForImg];
    const url = finalImage.url;
    const title = finalImage.title;
    //Post the final Image
    try {
        //Get the Guild the message was sent fron
        const currentGuild = msg.guild;
        const channelToSendTo = config.pornImageDestinationChannel;
        //Check if the channel specified exists
        const channel = currentGuild.channels.find('name', channelToSendTo);
        //Check if a user should be mentioned
        if (annotation.length >= 1) {
            if (title === '') {
                channel.send(`${userIDs}\r\nYour porn:\r\n **Title:** **<Not available>**\r\n" + ${url}`);
            }
            else {
                channel.send(`${userIDs}\r\nYour porn: \r\n **Title:** **${title}**\r\n + ${url}`);
            } 
        }
        else {
            if (title === '') {
                channel.send("Your porn: \r\n **Title:** **<Not available>**\r\n" + url);
            }
            else {
                channel.send("Your porn: \r\n **Title:** **" + title + "**\r\n" + url);
            }            
        }
    }
    catch (e) {
        msg.reply("Some error occured.... Maybe try again later you filthy animal.");
    }
    return;
}
/**
 * Returns an array of url's and titles (as available) to images
 * @param {String} website 
 * @param {*} msg 
 */
const getSomeImages = async (website, msg) => {
    //check from which supported plattform the images are getting pulled from
    //multi.xnxx.com
    if (website.includes("multi.xnxx.com")) {
        return await getSomeImagesXNXX(website, msg);

    }
    else if (website.includes("redpornpictures.com")) {
        return await getSomeImagesREDPORNPICTURE(website, msg);
    }
    else {
        msg.reply("Oops! Something went wrong.");
    }
}

////////////////////////////////////
/// Website specific crawlers   ////
////////////////////////////////////

/**
 * Returns an array of url's and titles (as available) to images
 * 
 * ONLY works for multi.xnxx.com URLs !!!
 * @param {String} website 
 * @param {*} msg 
 */
const getSomeImagesXNXX = (website, msg) => {
    let currentCollection = [];
    return new Promise((resolve, reject) => {
        request(website, function (error, response, body) {
            //check if the request could be made
            if(error){
                msg.reply("Oops! Something went wrong.");
                return;
            }
            let title = "";
            let url = "";
            let $ = cheerio.load(body);
            //Do some cherio magic to get the url and title (if available)
            $('.boxImg,.size_new_big,.home1,.thumb').each(function (index) {
                title = $(this).find('span.smallDesc, span.bigDesc, span.medDesc').text();
                url = $(this).find('img.thumb, img.img-responsive').attr('src');
                //Append to the collection
                if (url !== undefined) {
                    currentCollection.push({ url: url, title: title });
                }
            });
            resolve(currentCollection);
        });
    });
}

/**
 * Returns an array of url's and titles (as available) to images
 * 
 * ONLY works for redpornpictures.com URLs !!!
 * @param {String} website 
 * @param {*} msg 
 */
const getSomeImagesREDPORNPICTURE = (website, msg) => {
    let currentCollection = [];
    return new Promise((resolve, reject) => {
        request(website, function (error, response, body) {
            //check if the request could be made
            if(error){
                msg.reply("Oops! Something went wrong.");
                return;
            }
            let title = "";
            let url = "";
            let $ = cheerio.load(body);
            //Do some cherio magic to get the url and title (if available)
            $('li .single-portfolio, .col-full-3, .transparent, .checked').each(function (index) {
                title = $(this).find('img .img-full-responsive, .loaded').attr('alt');
                url = $(this).find('img .img-full-responsive, .loaded').attr('src');
                //Append to the collection
                if (url !== undefined) {
                    currentCollection.push({ url: url, title: title });
                }
            });
            resolve(currentCollection);
        }); 
    });
}

module.exports = { command, handle };