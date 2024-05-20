export function generateSlug(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();
  // remove accents, swap ñ for n, etc
  const from = 'ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;';
  const to = 'aaaaaeeeeeiiiiooooouuuunc------';
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes
  return str + +new Date();
}

// function create random character with length
export function createRandomString(length = 0) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Check if string is json
export function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

// remove vietnamese character
export function removeVietnameseTones(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, ' ');
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ' ',
  );
  return str.replace(/[^\w\s]/gi, '');
}

export const logYellow = (message: string) => `\x1b[33m${message}\x1b[0m`;
export const logRed = (message: string) => `\x1b[91m${message}\x1b[0m`;

// Parse name store from url shopify
export function parseNameStoreFromUrl(url: string): string {
  const newUrl = url
    .replace('https://', '')
    .replace('http://', '')
    .replace('www.', '')
    .replace('vn.', '')
    .replace('.vn', '')
    .replace('.com', '');

  const arrString = newUrl.split('/');
  return arrString[0];
}
function detectAndTagText(inputString) {
  // Regular expression to match URLs
  const regex = /(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[^\s]+/g;

  // Replace each matched link with an <a> tag
  const outputString = inputString.replace(regex, (match) => {
    if (match.startsWith('http://') || match.startsWith('https://')) {
      return `<a target="_blank" href="${match}">${match}</a>`;
    } else {
      return match;
    }
  });

  // Return the modified input string
  return outputString;
}

function addSpaceBeforeHttp(text) {
  // This regex looks for occurrences of 'http' or 'https' that are not
  // immediately preceded by a quote or a space.
  // \S matches any non-whitespace character
  // (?<!...) is a negative lookbehind assertion
  const regex = /(?<!["\s])(https?:\/\/)/g;

  // Replace matches with a space followed by the match
  return text.replace(regex, ' $1');
}

function addSpaceAfterHttp(inputString) {
  // Regular expression to match URLs
  const regex = /(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[^\s]+/g;

  // Replace each matched link with an <a> tag
  const outputString = inputString.replace(regex, (match) => {
    if (match.startsWith('http://') || match.startsWith('https://')) {
      if (match[match.length - 1] === ']' || match[match.length - 1] === ')') {
        let newMatch =
          match.slice(0, match.length - 1) + ` ${match[match.length - 1]}`;
        return newMatch;
        // then add space before end string of match
      }
      return match;
    } else {
      return match;
    }
  });

  // Return the modified input string
  return outputString;
}

function addNewlineBeforeRomanNumerals(inputText) {
  // Define a regular expression pattern to match Roman numerals with a dot (I., II., III., etc.)
  const regex = /(I\.|II\.|III\.|IV\.|V\.|VI\.|VII\.|VIII\.|IX\.|X\.)(?=\s|$)/g;

  // Use the replace method to add a newline before matched Roman numerals
  const modifiedText = inputText.replace(regex, '\n$1');

  return modifiedText;
}

function convertToHyperlinks(text: string): string {
  // Regular expression pattern for matching 'text: link' format and wrapping the last word before the link in an anchor tag
  const replaceTextColonLink: RegExp =
    /(.+?)\s+([^\s]+)\s*:\s*(https?:\/\/\S+)$/;

  // Regular expression pattern for matching 'text: [link]' format and wrapping the last word before the link in an anchor tag
  const replaceTextBracketLink: RegExp =
    /(.+?)\s+([^\s]+)\s*:\s*\[(https?:\/\/\S+)\]$/;

  // Regular expression pattern for matching '[text] link' format and wrapping the word in brackets before the link in an anchor tag
  const replaceBracketLink: RegExp = /(.+?)\s+\[([^\]]+)\]\s*(https?:\/\/\S+)$/;

  // Regular expression pattern for matching 'text: (link)' format and wrapping the last word before the link in an anchor tag
  const replaceTextParenLink: RegExp =
    /(.+?)\s+([^\s]+)\s*:\s*\((https?:\/\/\S+)\)$/;

  const convertedText = text
    .split('\n')
    .map((line) => {
      if (replaceTextColonLink.test(line)) {
        return line.replace(replaceTextColonLink, '$1 <a href="$3">$2</a>');
      } else if (replaceTextBracketLink.test(line)) {
        return line.replace(replaceTextBracketLink, '$1 <a href="$3">$2</a>');
      } else if (replaceBracketLink.test(line)) {
        return line.replace(replaceBracketLink, '$1 <a href="$3">$2</a>');
      } else if (replaceTextParenLink.test(line)) {
        return line.replace(replaceTextParenLink, '$1 <a href="$3">$2</a>');
      }
      return line;
    })
    .join('\n');
  return convertedText;
}

function convertURLsToHyperlinks(text) {
  return text.replace(
    /<a\s+[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>|(\bhttps?:\/\/[-A-Z0-9+&@#/%=~_|$?!:,.]*[-A-Z0-9+&@#/%=~_|$])/gi,
    (match, href, anchorText, plainUrl) => {
      if (href && anchorText) {
        // Xóa phần truy vấn từ URL trong href và nội dung thẻ <a>
        const baseHref = href.split('?')[0];
        const baseAnchorText = anchorText.split('?')[0];

        // So sánh phần cơ bản của URL, nếu khác nhau không thay thế
        if (baseHref === baseAnchorText) {
          return match;
        }
      }
      // Xử lý cho URLs không nằm trong thẻ <a>
      if (plainUrl) {
        return `<a target="_blank" href="${plainUrl}">${plainUrl}</a>`;
      }

      return match;
    },
  );
}

function removeDotFromAnchorTagURLs(inputString) {
  // Sử dụng biểu thức chính quy để tìm tất cả các thẻ <a> có href
  return inputString.replace(
    /<a\s+(.*?)href="([^"]+)"(.*?)>/gi,
    (match, prefix, url, suffix) => {
      // Kiểm tra và loại bỏ dấu chấm cuối cùng từ URL
      const updatedUrl = url.endsWith('.') ? url.slice(0, -1) : url;

      // Trả về thẻ <a> với URL đã được cập nhật

      return `<a ${prefix}href="${updatedUrl}"${suffix}>`;
    },
  );
}

export const processString = (content: string) => {
  let contentTest = content;
  let contentProcess = addNewlineBeforeRomanNumerals(contentTest);
  return contentProcess;
};

// Count how many words in a string not including second string
export const countWordsNotIncludeInCompareString = (
  text: string,
  textCompare: string,
) => {
  let total = 0;
  const arrText = text.split(' ');
  console.log('arrText', arrText);
  if (text.length < 6) {
    return 99;
  }
  arrText.forEach((word) => {
    if (!textCompare.includes(word) && word != '?' && word != ':') {
      total += 1;
    }
  });
  return total;
};

// Remove all string start by [ and end by [  and content is not a link
export const removeStringStartByBracket = (text: string) => {
  let newText = text;
  const regex = /\[([^\]]+)\]/g;
  newText = newText.replace(regex, '');
  return newText;
};

// remove removeQuotes of start and end string
export const removeQuotes = (text: string) => {
  let newText = text;
  newText = newText.replace(/"/g, '');
  return newText;
};

export const removeSingleQuotes = (text: string) => {
  // Loại bỏ khoảng trắng ở đầu và cuối chuỗi
  let trimmedStr = text.trim();

  // Kiểm tra và loại bỏ dấu ngoặc kép ở đầu và cuối chuỗi
  if (trimmedStr.startsWith('"') && trimmedStr.endsWith('"')) {
    trimmedStr = trimmedStr.substring(1, trimmedStr.length - 1);
  }

  return trimmedStr;
};

export const processReplaceCompanyName = (
  term: any,
  reply_lang: string,
  company_name: string,
): string => {
  let newTerm = term;
  if (reply_lang === 'Vietnamese') {
    newTerm = newTerm.replace(company_name, 'công ty');
  } else {
    newTerm = newTerm.replace(company_name, 'company');
  }
  return newTerm;
};

// process get term search
export const processCleanTermSearch = (
  term: any,
  reply_language,
  company_name,
) => {
  let newTerm = term;
  newTerm = newTerm
    .replace('Formulated Search String:', '')
    .replace('Chuỗi tìm kiếm:', '')
    .replace('Response:', '')
    .replace('Từ khóa tìm kiếm:');
  newTerm = newTerm
    .replace('Answer:', '')
    .replace('Đáp lại:', '')
    .replace('Câu trả lời:', '')
    .replace('TRẢ LỜI:', '')
    .replace('Trả lời:', '');
  newTerm = newTerm.trim();
  newTerm = removeQuotes(newTerm);
  newTerm = processReplaceCompanyName(newTerm, reply_language, company_name);
  return newTerm;
};

export const processCleanSummary = (content: string) => {
  let newContent = content;
  newContent = newContent
    .replace('Summary:', '')
    .replace('Tóm tắt:', '')
    .replace('-', '');
  newContent = newContent.trim();
  newContent = removeQuotes(newContent);
  return newContent;
};

export const processReduceDataArticle = (contentHtml: string) => {
  try {
    const regex =
      /(<h1[^>]*>[\s\S]*?)(?=<h1|<h2|<h3|$)|(<h2[^>]*>[\s\S]*?)(?=<h1|<h2|<h3|$)|(<h3[^>]*>[\s\S]*?)(?=<h1|<h2|<h3|$)/g;

    // Find all matches
    const matches = contentHtml.match(regex);

    return matches;
  } catch (error) {
    throw error;
  }
};

export const removeUpperCaseWord = (question: string, queryTexts: string[]) => {
  queryTexts.map((queryText) => {
    if (queryText == queryText.toUpperCase()) {
      question = question.replace(queryText, '');
    }
  });
  return question;
};

// Remove character } and {  from string
export const removeBracket = (text: string) => {
  if (!text) {
    return '';
  }
  let newText = text;
  newText = newText.replace(/{/g, '');
  newText = newText.replace(/}/g, '');
  return newText;
};

export const processConvertReplaceCompanyName = (
  term: any,
  reply_lang: string,
  company_name: string,
): string => {
  let newTerm = term;
  if (reply_lang === 'Vietnamese') {
    newTerm = newTerm.replace('công ty', company_name);
  } else {
    newTerm = newTerm.replace('company', company_name);
  }
  return newTerm;
};

export const replaceSomeTermOfWordInQuestion = (question: string) => {
  let newTerm = question;
  newTerm = newTerm.replace('MB bank', 'MBbank');
  return newTerm;
};

// Process string final answer
export const processFinalAnswer = (
  answer: any,
  company_name,
  reply_language,
) => {
  let processAnswer = answer;
  processAnswer = processAnswer
    .replaceAll('NO ANSWER:', '')
    .replace('ANSWER:', '')
    .replace('Answer:', '')
    .replace('RESPONSE:', '');
  processAnswer = removeSingleQuotes(processAnswer);
  processAnswer = processConvertReplaceCompanyName(
    processAnswer,
    reply_language,
    company_name,
  );
  processAnswer = replaceSomeTermOfWordInQuestion(processAnswer);
  return processAnswer;
};

export const getStatusFetchLink = async (url: string) => {
  try {
    const response = await fetch(url);
    return response.status; // Returns the HTTP status code
  } catch (error) {
    console.error('Error fetching URL:', error);
  }
};

export const processGetFinalBuildSql = (rawlSql: string) => {
  try {
    let finalSql = rawlSql;
    if (finalSql.includes('NONE_SQL')) {
      return null;
    }
    finalSql = finalSql.replace('RAW SQL:', '').trim();
    return finalSql;
  } catch (error) {
    throw error;
  }
};

export const getTextSearchString = (str: string): string => {
  return (
    removeVietnameseTones(str)
      .split(' ')
      .filter((item) => item !== '')
      .join(' & ') + ':*'
  );
};

export function uppercaseFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// export function extractLinksFromHTML(html: string): string[] {
//   const links: string[] = [];

//   // Load the HTML into a Cheerio instance
//   const $ = cheerio.load(html);

//   // Extract links from anchor tags
//   $('a').each((index, element) => {
//     const href = $(element).attr('href');
//     if (href) {
//       links.push(href);
//     }
//   });

//   // Extract links from the text content
//   const textContent = $('body').text();
//   const urlRegex = /(https?:\/\/[^\s]+)/g;
//   const matches = textContent.match(urlRegex);
//   if (matches) {
//     links.push(...matches);
//   }

//   return links;
// }