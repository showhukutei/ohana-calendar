import React, { useState, useEffect, useRef } from 'react';
import { Volume2, ChevronLeft, Award, RefreshCw, Star, Compass, BookOpen, VolumeX, Check, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// 40の言語データ
const LANGUAGES = [
  { id: 'en', name: '英語', native: 'English', code: 'en-US', flag: '🇺🇸' },
  { id: 'es', name: 'スペイン語', native: 'Español', code: 'es-ES', flag: '🇪🇸' },
  { id: 'fr', name: 'フランス語', native: 'Français', code: 'fr-FR', flag: '🇫🇷' },
  { id: 'de', name: 'ドイツ語', native: 'Deutsch', code: 'de-DE', flag: '🇩🇪' },
  { id: 'it', name: 'イタリア語', native: 'Italiano', code: 'it-IT', flag: '🇮🇹' },
  { id: 'ru', name: 'ロシア語', native: 'Русский', code: 'ru-RU', flag: '🇷🇺' },
  { id: 'zh', name: '中国語', native: '中文', code: 'zh-CN', flag: '🇨🇳' },
  { id: 'ko', name: '韓国語', native: '한국어', code: 'ko-KR', flag: '🇰🇷' },
  { id: 'ar', name: 'アラビア語', native: 'العربية', code: 'ar-XA', flag: '🇸🇦' },
  { id: 'th', name: 'タイ語', native: 'ภาษาไทย', code: 'th-TH', flag: '🇹🇭' },
  { id: 'hi', name: 'ヒンディー語', native: 'हिन्दी', code: 'hi-IN', flag: '🇮🇳' },
  { id: 'vi', name: 'ベトナム語', native: 'Tiếng Việt', code: 'vi-VN', flag: '🇻🇳' },
  { id: 'el', name: 'ギリシャ語', native: 'Ελληνικά', code: 'el-GR', flag: '🇬🇷' },
  { id: 'he', name: 'ヘブライ語', native: 'עברית', code: 'he-IL', flag: '🇮🇱' },
  { id: 'uk', name: 'ウクライナ語', native: 'Українська', code: 'uk-UA', flag: '🇺🇦' },
  { id: 'fa', name: 'ペルシャ語', native: 'فارسی', code: 'fa-IR', flag: '🇮🇷' },
  { id: 'ur', name: 'ウルドゥー語', native: 'اردو', code: 'ur-PK', flag: '🇵🇰' },
  { id: 'ta', name: 'タミル語', native: 'தமிழ்', code: 'ta-IN', flag: '🇮🇳' },
  { id: 'te', name: 'テルグ語', native: 'తెలుగు', code: 'te-IN', flag: '🇮🇳' },
  { id: 'bn', name: 'ベンガル語', native: 'বাংলা', code: 'bn-BD', flag: '🇧🇩' },
  { id: 'gu', name: 'グジャラート語', native: 'ગુજરાતી', code: 'gu-IN', flag: '🇮🇳' },
  { id: 'km', name: 'クメール語', native: 'ភាសាខ្មែរ', code: 'km-KH', flag: '🇰🇭' },
  { id: 'lo', name: 'ラオス語', native: 'ພາສາລາວ', code: 'lo-LA', flag: '🇱🇦' },
  { id: 'my', name: 'ビルマ語', native: 'မြန်မာဘာသာ', code: 'my-MM', flag: '🇲🇲' },
  { id: 'ka', name: 'ジョージア語', native: 'ქართული', code: 'ka-GE', flag: '🇬🇪' },
  { id: 'hy', name: 'アルメニア語', native: 'Հայերեն', code: 'hy-AM', flag: '🇦🇲' },
  { id: 'am', name: 'アムハラ語', native: 'አማርኛ', code: 'am-ET', flag: '🇪🇹' },
  { id: 'si', name: 'シンハラ語', native: 'සිංහල', code: 'si-LK', flag: '🇱καν' },
  { id: 'ne', name: 'ネパール語', native: 'नेपाली', code: 'ne-NP', flag: '🇳🇵' },
  { id: 'mn', name: 'モンゴル語', native: 'Монгол', code: 'mn-MN', flag: '🇲🇳' },
  { id: 'tr', name: 'トルコ語', native: 'Türkçe', code: 'tr-TR', flag: '🇹🇷' },
  { id: 'nl', name: 'オランダ語', native: 'Nederlands', code: 'nl-NL', flag: '🇳🇱' },
  { id: 'pl', name: 'ポーランド語', native: 'Polski', code: 'pl-PL', flag: '🇵🇱' },
  { id: 'sv', name: 'スウェーデン語', native: 'Svenska', code: 'sv-SE', flag: '🇸🇪' },
  { id: 'fi', name: 'フィンランド語', native: 'Suomi', code: 'fi-FI', flag: '🇫🇮' },
  { id: 'cs', name: 'チェコ語', native: 'Čeština', code: 'cs-CZ', flag: '🇨🇿' },
  { id: 'id', name: 'インドネシア語', native: 'Bahasa Indonesia', code: 'id-ID', flag: '🇮🇩' },
  { id: 'ms', name: 'マレー語', native: 'Bahasa Melayu', code: 'ms-MY', flag: '🇲🇾' },
  { id: 'fil', name: 'フィリピン語', native: 'Filipino', code: 'fil-PH', flag: '🇵🇭' },
  { id: 'sw', name: 'スワヒリ語', native: 'Kiswahili', code: 'sw-KE', flag: '🇰🇪' }
];

// 言葉の定義（スプランキーキャラクターと連動）
const WORDS = [
  { id: 'hello', name: 'こんにちは' },
  { id: 'thank_you', name: 'ありがとう' },
  { id: 'delicious', name: 'おいしい' },
  { id: 'good_night', name: 'おやすみ' },
  { id: 'love_you', name: 'すき' },
  { id: 'sun', name: 'たいよう' },
  { id: 'star', name: 'ほし' },
  { id: 'dog', name: 'いぬ' },
  { id: 'cat', name: 'ねこ' },
  { id: 'water', name: 'みず' }
];

// 40言語翻訳データ
const TRANSLATIONS = {
  en: {
    hello: { text: 'Hello', kana: 'ハロー', romaji: 'Hello' },
    thank_you: { text: 'Thank you', kana: 'サンキュー', romaji: 'Thank you' },
    delicious: { text: 'Delicious', kana: 'デリシャス', romaji: 'Delicious' },
    good_night: { text: 'Good night', kana: 'グッドナイト', romaji: 'Good night' },
    love_you: { text: 'I love you', kana: 'アイラブユー', romaji: 'I love you' },
    sun: { text: 'Sun', kana: 'サン', romaji: 'Sun' },
    star: { text: 'Star', kana: 'スター', romaji: 'Star' },
    dog: { text: 'Dog', kana: 'ドッグ', romaji: 'Dog' },
    cat: { text: 'Cat', kana: 'キャット', romaji: 'Cat' },
    water: { text: 'Water', kana: 'ウォーター', romaji: 'Water' }
  },
  es: {
    hello: { text: 'Hola', kana: 'オラ', romaji: 'Hola' },
    thank_you: { text: 'Gracias', kana: 'グラシアス', romaji: 'Gracias' },
    delicious: { text: 'Delicioso', kana: 'デリシオーソ', romaji: 'Delicioso' },
    good_night: { text: 'Buenas noches', kana: 'ブエナスノーチェス', romaji: 'Buenas noches' },
    love_you: { text: 'Te amo', kana: 'テアモ', romaji: 'Te amo' },
    sun: { text: 'Sol', kana: 'ソル', romaji: 'Sol' },
    star: { text: 'Estrella', kana: 'エストレージャ', romaji: 'Estrella' },
    dog: { text: 'Perro', kana: 'ペロ', romaji: 'Perro' },
    cat: { text: 'Gato', kana: 'ガト', romaji: 'Gato' },
    water: { text: 'Agua', kana: 'アグア', romaji: 'Agua' }
  },
  fr: {
    hello: { text: 'Bonjour', kana: 'ボンジュール', romaji: 'Bonjour' },
    thank_you: { text: 'Merci', kana: 'メルシー', romaji: 'Merci' },
    delicious: { text: 'Délicieux', kana: 'デリシュー', romaji: 'Délicieux' },
    good_night: { text: 'Bonne nuit', kana: 'ボンニュイ', romaji: 'Bonne nuit' },
    love_you: { text: "Je t'aime", kana: 'ジュテーム', romaji: "Je t'aime" },
    sun: { text: 'Soleil', kana: 'ソレイユ', romaji: 'Soleil' },
    star: { text: 'Étoile', kana: 'エトワール', romaji: 'Étoile' },
    dog: { text: 'Chien', kana: 'シアン', romaji: 'Chien' },
    cat: { text: 'Chat', kana: 'シャ', romaji: 'Chat' },
    water: { text: 'Eau', kana: 'オ', romaji: 'Eau' }
  },
  de: {
    hello: { text: 'Hallo', kana: 'ハロー', romaji: 'Hallo' },
    thank_you: { text: 'Danke', kana: 'ダンケ', romaji: 'Danke' },
    delicious: { text: 'Lecker', kana: 'レッカー', romaji: 'Lecker' },
    good_night: { text: 'Gute Nacht', kana: 'グーテ・ナハト', romaji: 'Gute Nacht' },
    love_you: { text: 'Ich liebe dich', kana: 'イッヒ・リーベ・ディッヒ', romaji: 'Ich liebe dich' },
    sun: { text: 'Sonne', kana: 'ゾネ', romaji: 'Sonne' },
    star: { text: 'Stern', kana: 'シュテルン', romaji: 'Stern' },
    dog: { text: 'Hund', kana: 'フント', romaji: 'Hund' },
    cat: { text: 'Katze', kana: 'カッツェ', romaji: 'Katze' },
    water: { text: 'Wasser', kana: 'ヴァッサー', romaji: 'Wasser' }
  },
  it: {
    hello: { text: 'Ciao', kana: 'チャオ', romaji: 'Ciao' },
    thank_you: { text: 'Grazie', kana: 'グラッツェ', romaji: 'Grazie' },
    delicious: { text: 'Delizioso', kana: 'デリツィオーゾ', romaji: 'Delizioso' },
    good_night: { text: 'Buonanotte', kana: 'ブオナノッテ', romaji: 'Buonanotte' },
    love_you: { text: 'Ti amo', kana: 'ティアモ', romaji: 'Ti amo' },
    sun: { text: 'Sole', kana: 'ソーレ', romaji: 'Sole' },
    star: { text: 'Stella', kana: 'ステッラ', romaji: 'Stella' },
    dog: { text: 'Cane', kana: 'カーネ', romaji: 'Cane' },
    cat: { text: 'Gato', kana: 'ガット', romaji: 'Gatto' },
    water: { text: 'Acqua', kana: 'アクア', romaji: 'Acqua' }
  },
  ru: {
    hello: { text: 'Привет', kana: 'プリヴィエト', romaji: 'Privet' },
    thank_you: { text: 'Спасибо', kana: 'スパシーバ', romaji: 'Spasibo' },
    delicious: { text: 'Вкусно', kana: 'フクースナ', romaji: 'Vkusno' },
    good_night: { text: 'Спокойной ночи', kana: 'スパコイノイノーチ', romaji: 'Spokoynoy nochi' },
    love_you: { text: 'Я тебя люблю', kana: 'ヤ チビャー リュブリュー', romaji: 'Ya tebya lyublyu' },
    sun: { text: 'Солнце', kana: 'ソーンツェ', romaji: 'Solntse' },
    star: { text: 'Звезда', kana: 'ズヴェズダー', romaji: 'Zvezda' },
    dog: { text: 'Собака', kana: 'サバーカ', romaji: 'Sobaka' },
    cat: { text: 'Кот', kana: 'コート', romaji: 'Kot' },
    water: { text: 'Вода', kana: 'ヴァダー', romaji: 'Voda' }
  },
  zh: {
    hello: { text: '你好', kana: 'ニーハオ', romaji: 'Nǐ hǎo' },
    thank_you: { text: '谢谢', kana: 'シェシェ', romaji: 'Xièxie' },
    delicious: { text: '好吃', kana: 'ハオチー', romaji: 'Hǎochī' },
    good_night: { text: '晚安', kana: 'ワンアン', romaji: 'Wǎn\'ān' },
    love_you: { text: '我爱你', kana: 'ウォアイニー', romaji: 'Wǒ ài nǐ' },
    sun: { text: '太阳', kana: 'タイヤン', romaji: 'Tàiyáng' },
    star: { text: '星星', kana: 'シンシン', romaji: 'Xīngxing' },
    dog: { text: '狗', kana: 'ゴウ', romaji: 'Gǒu' },
    cat: { text: '猫', kana: 'マオ', romaji: 'Māo' },
    water: { text: '水', kana: 'シュイ', romaji: 'Shuǐ' }
  },
  ko: {
    hello: { text: '안녕하세요', kana: 'アンニョンハセヨ', romaji: 'Annyeonghaseyo' },
    thank_you: { text: '감사합니다', kana: 'カムサハムニダ', romaji: 'Gamsahabnida' },
    delicious: { text: '맛있어요', kana: 'マシッソヨ', romaji: 'Masisseoyo' },
    good_night: { text: '잘 자요', kana: 'チャルジャヨ', romaji: 'Jal jayo' },
    love_you: { text: '사랑해요', kana: 'サランヘヨ', romaji: 'Saranghaeyo' },
    sun: { text: '태양', kana: 'テヤン', romaji: 'Taeyang' },
    star: { text: '별', kana: 'ピョル', romaji: 'Byeol' },
    dog: { text: '개', kana: 'ケ', romaji: 'Gae' },
    cat: { text: '고양이', kana: 'コヤンイ', romaji: 'Goyang-i' },
    water: { text: '물', kana: 'ムル', romaji: 'Mul' }
  },
  ar: {
    hello: { text: 'مرحبا', kana: 'マルハバン', romaji: 'Marhaban' },
    thank_you: { text: 'شكرا', kana: 'シュクラン', romaji: 'Shukran' },
    delicious: { text: 'لذيذ', kana: 'ラズィーズ', romaji: 'Ladheedh' },
    good_night: { text: 'تصبح على خير', kana: 'タスバハ・アラー・ハイル', romaji: 'Tusbih \'ala khair' },
    love_you: { text: 'أحبك', kana: 'ウヒッブカ', romaji: 'Uhibbuka' },
    sun: { text: 'شمس', kana: 'シャムス', romaji: 'Shams' },
    star: { text: 'نجمة', kana: 'ナジマ', romaji: 'Najmah' },
    dog: { text: 'كلب', kana: 'カルブ', romaji: 'Kalb' },
    cat: { text: 'قط', kana: 'キット', romaji: 'Qitt' },
    water: { text: 'ماء', kana: 'マーウ', romaji: 'Ma\'' }
  },
  th: {
    hello: { text: 'สวัสดี', kana: 'サワディー', romaji: 'Sawasdee' },
    thank_you: { text: 'ขอบคุณ', kana: 'コープクン', romaji: 'Khob khun' },
    delicious: { text: 'อร่อย', kana: 'アロイ', romaji: 'Aroi' },
    good_night: { text: 'ราตรีสวัสดิ์', kana: 'ラートリーサワット', romaji: 'Ratri sawat' },
    love_you: { text: 'รักคุณ', kana: 'ラッククン', romaji: 'Rak khun' },
    sun: { text: 'พระอาทิตย์', kana: 'プラアーティット', romaji: 'Phra athit' },
    star: { text: 'ดาว', kana: 'ダーオ', romaji: 'Dao' },
    dog: { text: 'สุนัข', kana: 'スナック', romaji: 'Sunakh' },
    cat: { text: 'แมว', kana: 'メーオ', romaji: 'Maew' },
    water: { text: 'น้ำ', kana: 'ナーム', romaji: 'Nam' }
  },
  hi: {
    hello: { text: 'नमस्ते', kana: 'ナマステ', romaji: 'Namaste' },
    thank_you: { text: 'धन्यवाद', kana: 'ダンニャワード', romaji: 'Dhanyavaad' },
    delicious: { text: 'स्वादिष्ट', kana: 'スワーディシュト', romaji: 'Svaadisht' },
    good_night: { text: 'शुभ रात्रि', kana: 'シュブ・ラートリ', romaji: 'Shubh raatri' },
    love_you: { text: 'मैं आपसे प्यार करता हूँ', kana: 'アープセ・ピヤール・カルター・フーン', romaji: 'Main aapase pyaar karata hoon' },
    sun: { text: 'सूर्य', kana: 'スーリヤ', romaji: 'Soorya' },
    star: { text: 'तारा', kana: 'ターラー', romaji: 'Taara' },
    dog: { text: 'कुत्ता', kana: 'クッタ', romaji: 'Kutta' },
    cat: { text: 'बिल्ली', kana: 'ビッリー', romaji: 'Billi' },
    water: { text: 'पानी', kana: 'パーニー', romaji: 'Paanee' }
  },
  vi: {
    hello: { text: 'Xin chào', kana: 'シンチャオ', romaji: 'Xin chao' },
    thank_you: { text: 'Cảm ơn', kana: 'カモン', romaji: 'Cam on' },
    delicious: { text: 'Ngon', kana: 'ンゴン', romaji: 'Ngon' },
    good_night: { text: 'Chúc ngủ ngon', kana: 'チュック・グー・ンゴン', romaji: 'Chuc ngu ngon' },
    love_you: { text: 'Anh yêu em', kana: 'アン・イェウ・エム', romaji: 'Anh yeu em' },
    sun: { text: 'Mặt trời', kana: 'マッ・チョイ', romaji: 'Mat troi' },
    star: { text: 'Ngôi sao', kana: 'ンゴイ・サオ', romaji: 'Ngoi sao' },
    dog: { text: 'Chó', kana: 'チョー', romaji: 'Cho' },
    cat: { text: 'Mèo', kana: 'メオ', romaji: 'Meo' },
    water: { text: 'Nước', kana: 'ヌオック', romaji: 'Nuoc' }
  },
  el: {
    hello: { text: 'Γεια σας', kana: 'ヤサス', romaji: 'Geia sas' },
    thank_you: { text: 'Ευχαριστώ', kana: 'エフハリスト', romaji: 'Efcharisto' },
    delicious: { text: 'Νόστιμο', kana: 'ノスティモ', romaji: 'Nostimo' },
    good_night: { text: 'Καληνύχτα', kana: 'カリニフタ', romaji: 'Kalinychta' },
    love_you: { text: "Σ' αγαπώ", kana: 'サガポ', romaji: "S' agapo" },
    sun: { text: 'Ήλιος', kana: 'イリオス', romaji: 'Ilios' },
    star: { text: 'Αστέρι', kana: 'アステリ', romaji: 'Asteri' },
    dog: { text: 'Σκύλος', kana: 'スキロス', romaji: 'Skylos' },
    cat: { text: 'Γάτα', kana: 'ガタ', romaji: 'Gata' },
    water: { text: 'Νερό', kana: 'ネロ', romaji: 'Nero' }
  },
  he: {
    hello: { text: 'שלום', kana: 'シャローム', romaji: 'Shalom' },
    thank_you: { text: 'תודה', kana: 'トダ', romaji: 'Toda' },
    delicious: { text: 'טעים', kana: 'タイーム', romaji: 'Taim' },
    good_night: { text: 'ליله טוב', kana: 'ライラ・トヴ', romaji: 'Layla tov' },
    love_you: { text: 'אני אוהב אותך', kana: 'アニ・オヘヴ・オタフ', romaji: 'Ani ohev otakh' },
    sun: { text: 'שמש', kana: 'シェメシュ', romaji: 'Shemesh' },
    star: { text: 'כוכב', kana: 'コハヴ', romaji: 'Kokhav' },
    dog: { text: 'כלב', kana: 'ケレヴ', romaji: 'Kelev' },
    cat: { text: 'חתול', kana: 'ハトゥル', romaji: 'Khatul' },
    water: { text: 'מים', kana: 'マイム', romaji: 'Mayim' }
  },
  uk: {
    hello: { text: 'Привіт', kana: 'プリヴィエト', romaji: 'Pryvit' },
    thank_you: { text: 'Дякую', kana: 'デャークユ', romaji: 'Dyakuyu' },
    delicious: { text: 'Смачно', kana: 'スマートノ', romaji: 'Smachno' },
    good_night: { text: 'На добраніч', kana: 'ナ・ドブラーニチ', romaji: 'Na dobranich' },
    love_you: { text: 'Я тебе кохаю', kana: 'ヤ・テベ・コハユ', romaji: 'Ya tebe kokhayu' },
    sun: { text: 'Сонце', kana: 'ソンツェ', romaji: 'Sontse' },
    star: { text: 'Зірка', kana: 'ジルカ', romaji: 'Zirka' },
    dog: { text: 'Собака', kana: 'サバーカ', romaji: 'Sobaka' },
    cat: { text: 'Кіт', kana: 'キット', romaji: 'Kit' },
    water: { text: 'Вода', kana: 'ヴォダー', romaji: 'Voda' }
  },
  fa: {
    hello: { text: 'سلام', kana: 'サラーム', romaji: 'Salaam' },
    thank_you: { text: 'ممنون', kana: 'マムヌーン', romaji: 'Mamnoon' },
    delicious: { text: 'خوشمزه', kana: 'ホシュマゼ', romaji: 'Khoshmazeh' },
    good_night: { text: 'شب بخیر', kana: 'シャブ・バヘア', romaji: 'Shab bekheyr' },
    love_you: { text: 'دوستت دارم', kana: 'ドゥースタト・ダーラム', romaji: 'Doostat daram' },
    sun: { text: 'خورشید', kana: 'ホルシード', romaji: 'Khorshid' },
    star: { text: 'ستاره', kana: 'セターレ', romaji: 'Setareh' },
    dog: { text: 'سگ', kana: 'サグ', romaji: 'Sag' },
    cat: { text: 'گربه', kana: 'ゴルベ', romaji: 'Gorbeh' },
    water: { text: 'آب', kana: 'アーブ', romaji: 'Aab' }
  },
  ur: {
    hello: { text: 'سلام', kana: 'サラーム', romaji: 'Salaam' },
    thank_you: { text: 'شکریہ', kana: 'シュクリヤ', romaji: 'Shukriya' },
    delicious: { text: 'مزیدار', kana: 'マゼダール', romaji: 'Mazedar' },
    good_night: { text: 'شب بخیر', kana: 'シャブ・バヘア', romaji: 'Shab khair' },
    love_you: { text: 'میں آپ سے محبت کرتا ہوں', kana: 'アープ・セ・ムハバト・カルタ・フーン', romaji: 'Main aap se mohabbat karta hoon' },
    sun: { text: 'سورج', kana: 'スラジ', romaji: 'Sooraj' },
    star: { text: 'ستارہ', kana: 'セターラ', romaji: 'Sitara' },
    dog: { text: 'کتا', kana: 'クッタ', romaji: 'Kutta' },
    cat: { text: 'بلی', kana: 'ビッリー', romaji: 'Billi' },
    water: { text: 'پانی', kana: 'パーニー', romaji: 'Paani' }
  },
  ta: {
    hello: { text: 'வணக்கம்', kana: 'ワナッカム', romaji: 'Vanakkam' },
    thank_you: { text: 'நன்றி', kana: 'ナンドゥリ', romaji: 'Nandri' },
    delicious: { text: 'சுவையானது', kana: 'スヴァイヤナドゥ', romaji: 'Suvaiyaanathu' },
    good_night: { text: 'இரவு வணக்கம்', kana: 'イラヴ・ワナッカム', romaji: 'Iravu vanakkam' },
    love_you: { text: 'நான் உன்னை காதலிக்கிறேன்', kana: 'ナーン・ウンナイ・カーダリッキレーン', romaji: 'Naan unnai kaadhalippan' },
    sun: { text: 'சூரியன்', kana: 'スーリヤン', romaji: 'Sooriyan' },
    star: { text: 'நட்சத்திரம்', kana: 'ナチャシラム', romaji: 'Natchathiram' },
    dog: { text: 'நாய்', kana: 'ナーイ', romaji: 'Naay' },
    cat: { text: 'பூனை', kana: 'プーナイ', romaji: 'Poonai' },
    water: { text: 'தண்ணீர்', kana: 'タンニール', romaji: 'Thanneer' }
  },
  te: {
    hello: { text: 'నమస్కారం', kana: 'ナマスカラム', romaji: 'Namaskaaram' },
    thank_you: { text: 'ధన్యవాదాలు', kana: 'ダンニャワーダール', romaji: 'Dhanyavaadaalu' },
    delicious: { text: 'రుచికరమైనది', kana: 'ルチカラマイナディ', romaji: 'Ruchikaramaainadhi' },
    good_night: { text: 'శుభ రాత్రి', kana: 'シュバ・ラートリ', romaji: 'Shubha raatri' },
    love_you: { text: 'నేను నిన్ను ప్రేమిస్తున్నాను', kana: 'ネーヌ・ニンヌ・プレーミストゥンナーヌ', romaji: 'Nenu ninnu premistunnanu' },
    sun: { text: 'సూర్యుడు', kana: 'スーリュドゥ', romaji: 'Sooryudu' },
    star: { text: 'నక్షత్రం', kana: 'ナクシャトラム', romaji: 'Nakshatram' },
    dog: { text: 'కుక్క', kana: 'クッカ', romaji: 'Kukka' },
    cat: { text: 'పిల్లి', kana: 'ピッリ', romaji: 'Pilli' },
    water: { text: 'నీరు', kana: 'ニール', romaji: 'Neeru' }
  },
  bn: {
    hello: { text: 'নমস্কার', kana: 'ノモシュカール', romaji: 'Nomoshkar' },
    thank_you: { text: 'ধন্যবাদ', kana: 'ドンノバッド', romaji: 'Dhonnobad' },
    delicious: { text: 'সুস্বাদু', kana: 'シュшаドゥ', romaji: 'Sushadu' },
    good_night: { text: 'শুভ রাত্রি', kana: 'シュボ・ラトリ', romaji: 'Shubo ratri' },
    love_you: { text: 'আমি তোমাকে ভালোবাসি', kana: 'アミ・トマケ・バロバシ', romaji: 'Ami tomake bhalobashi' },
    sun: { text: 'সূর্য', kana: 'シュルジョ', romaji: 'Shurjo' },
    star: { text: 'তারা', kana: 'タラ', romaji: 'Tara' },
    dog: { text: 'কুকুর', kana: 'ククール', romaji: 'Kukur' },
    cat: { text: 'বিড়াল', kana: 'ビラル', romaji: 'Biral' },
    water: { text: 'জল', kana: 'ジョル', romaji: 'Jol' }
  },
  gu: {
    hello: { text: 'નમસ્તે', kana: 'ナマステ', romaji: 'Namaste' },
    thank_you: { text: 'આભાર', kana: 'アバール', romaji: 'Aabhar' },
    delicious: { text: 'સ્વાદિષ્ટ', kana: 'スワーディシュト', romaji: 'Svaadist' },
    good_night: { text: 'શુભ રાત્રિ', kana: 'シュブ・ラートリ', romaji: 'Subh ratri' },
    love_you: { text: 'હું તને પ્રેમ કરું છું', kana: 'フン・タネ・プレーム・カルン・チュン', romaji: 'Hun tane prem karun chhun' },
    sun: { text: 'સૂર્ય', kana: 'スーリヤ', romaji: 'Surya' },
    star: { text: 'તારો', kana: 'タロ', romaji: 'Taro' },
    dog: { text: 'કૂતરો', kana: 'クトロ', romaji: 'Kutro' },
    cat: { text: 'બિલાડી', kana: 'ビラディ', romaji: 'Biladi' },
    water: { text: 'પાણી', kana: 'パーニー', romaji: 'Paani' }
  },
  km: {
    hello: { text: 'សួស្ដី', kana: 'スオスダイ', romaji: 'Suostei' },
    thank_you: { text: 'អរគុណ', kana: 'オークン', romaji: 'Orkun' },
    delicious: { text: 'ឆ្ងាញ់', kana: 'チュニャニュ', romaji: 'Chhnganh' },
    good_night: { text: 'រាត្រីសួស្តី', kana: 'リアトレイ・スオスダイ', romaji: 'Reatrei suostei' },
    love_you: { text: 'ខ្ញុំស្រឡាញ់អ្នក', kana: 'クニョム・スロラニュ・ネアック', romaji: 'Khnhom srolanh anak' },
    sun: { text: 'ព្រះអាទិត្យ', kana: 'プレア・アーティット', romaji: 'Preah athit' },
    star: { text: 'ផ្កាយ', kana: 'プカーイ', romaji: 'Phkay' },
    dog: { text: 'ឆ្កែ', kana: 'チュカエ', romaji: 'Chhkae' },
    cat: { text: 'ឆ្មា', kana: 'チュマー', romaji: 'Chhma' },
    water: { text: 'ទឹក', kana: 'タック', romaji: 'Tuek' }
  },
  lo: {
    hello: { text: 'ສະບາຍດີ', kana: 'サバイディー', romaji: 'Sabaidee' },
    thank_you: { text: 'ຂອບໃຈ', kana: 'コープチャイ', romaji: 'Khob chai' },
    delicious: { text: 'ແຊບ', kana: 'セープ', romaji: 'Saep' },
    good_night: { text: 'ຝັນດີ', kana: 'ファンディー', romaji: 'Fan dee' },
    love_you: { text: 'ຂ້ອຍຮັກເຈົ້າ', kana: 'コイ・ハック・チャオ', romaji: 'Khoi hak chao' },
    sun: { text: 'ຕາເວັນ', kana: 'ターウェン', romaji: 'Taven' },
    star: { text: 'ດາວ', kana: 'ダーオ', romaji: 'Dao' },
    dog: { text: 'ໝາ', kana: 'マー', romaji: 'Ma' },
    cat: { text: 'ແມວ', kana: 'メーオ', romaji: 'Maew' },
    water: { text: 'ນ້ໍາ', kana: 'ナーム', romaji: 'Nam' }
  },
  my: {
    hello: { text: 'မင်္ဂလာပါ', kana: 'ミンガラバー', romaji: 'Mingalabar' },
    thank_you: { text: 'ကျေးဇူးတင်ပါတယ်', kana: 'チェーズーティンバーデー', romaji: 'Kyeizu tinba de' },
    delicious: { text: 'အရသာရှိတယ်', kana: 'アヤダーシデー', romaji: 'Ayadashi de' },
    good_night: { text: 'ကောင်းသောညပါ', kana: 'カウンゾーニャーバー', romaji: 'Kaung dawt nya ba' },
    love_you: { text: 'မင်းကိုချစ်တယ်', kana: 'မင်းကိုချစ်တယ်', romaji: 'Min go chit de' },
    sun: { text: 'နေ', kana: 'ネー', romaji: 'Nay' },
    star: { text: 'ကြယ်', kana: 'チェー', romaji: 'Kye' },
    dog: { text: 'ခွေး', kana: 'クウェー', romaji: 'Khway' },
    cat: { text: 'ကြောင်', kana: 'チャウン', romaji: 'Kyaung' },
    water: { text: 'ရေ', kana: 'イェー', romaji: 'Yay' }
  },
  ka: {
    hello: { text: 'გამარჯობა', kana: 'ガマルジョバ', romaji: 'Gamarjoba' },
    thank_you: { text: 'გმადლობთ', kana: 'グマドロブト', romaji: 'Gmadlobt' },
    delicious: { text: 'გემრიელი', kana: 'ゲムリエリ', romaji: 'Gemrieli' },
    good_night: { text: 'ღამე მშვიდობისა', kana: 'ガメ・ムシュヴィドビサ', romaji: 'Game mshvidobisa' },
    love_you: { text: 'მე შენ მიყვარხარ', kana: 'メ・シェン・ミクヴァルハル', romaji: 'Me shen miqvarxar' },
    sun: { text: 'მზე', kana: 'მზე', romaji: 'Mze' },
    star: { text: 'ვარსკვლავი', kana: 'ვარსკვლავი', romaji: 'Varskvlavi' },
    dog: { text: 'ძაღლი', kana: 'ザグリ', romaji: 'Zaghli' },
    cat: { text: 'კატა', kana: 'カタ', romaji: 'Kata' },
    water: { text: 'წყალი', kana: 'ツカリ', romaji: 'Tsqali' }
  },
  hy: {
    hello: { text: 'Բարև', kana: 'バレフ', romaji: 'Barev' },
    thank_you: { text: 'Շնորհակալություն', kana: 'シュノルハカルチュン', romaji: 'Shnorhakalutyun' },
    delicious: { text: 'Համեղ', kana: 'ハメグ', romaji: 'Hamegh' },
    good_night: { text: 'Բարի գիշեր', kana: 'バリ・ギシェル', romaji: 'Bari gisher' },
    love_you: { text: 'Ես քեզ սիրում եմ', kana: 'エス・ケズ・シルム・エム', romaji: 'Yes kez sirum yem' },
    sun: { text: 'Արև', kana: 'アレヴ', romaji: 'Arev' },
    star: { text: 'Աստղ', kana: 'アストグ', romaji: 'Astgh' },
    dog: { text: 'Շուն', kana: 'シュン', romaji: 'Shun' },
    cat: { text: 'Կատու', kana: 'カトゥ', romaji: 'Katu' },
    water: { text: 'Ջուր', kana: 'ジュール', romaji: 'Jur' }
  },
  am: {
    hello: { text: 'ሰላም', kana: 'セラム', romaji: 'Selam' },
    thank_you: { text: 'አመሰግናለሁ', kana: 'アメセグナレフ', romaji: 'Ameseginalehu' },
    delicious: { text: 'ጣፋጭ', kana: 'タファチュ', romaji: 'T\'afach\'' },
    good_night: { text: 'ደህና እደሩ', kana: 'デフナ・イデル', romaji: 'Dehina ideru' },
    love_you: { text: 'እወድሃለሁ', kana: 'イウェディハレフ', romaji: 'Iwadihalehu' },
    sun: { text: 'ፀሐይ', kana: 'ツェハイ', romaji: 'Tsehay' },
    star: { text: 'ኮከብ', kana: 'コケブ', romaji: 'Kokebi' },
    dog: { text: 'ውሻ', kana: 'ウシャ', romaji: 'Wisha' },
    cat: { text: 'ድመት', kana: 'ディメト', romaji: 'Dimeti' },
    water: { text: 'உሃ', kana: 'ウハ', romaji: 'Wiha' }
  },
  si: {
    hello: { text: 'ආයුබෝවัน', kana: 'アーユボーワン', romaji: 'Ayubowan' },
    thank_you: { text: 'ස්තූතියි', kana: 'ストゥーティイ', romaji: 'Isthuthie' },
    delicious: { text: 'රසවත්', kana: 'ラサワット', romaji: 'Rasawath' },
    good_night: { text: 'සුබ රාත්‍රියක්', kana: 'スバ・ラートリヤック', romaji: 'Subha rathriyak' },
    love_you: { text: 'මම ඔබට ආදරෙයි', kana: 'ママ・オバタ・アーダレイ', romaji: 'Mama obata aadareyi' },
    sun: { text: 'සූර්යයා', kana: 'සූර්යයා', romaji: 'Sooryaya' },
    star: { text: 'තරුව', kana: 'タルワ', romaji: 'Tharuwa' },
    dog: { text: 'බල්ලා', kana: 'バッラー', romaji: 'Balla' },
    cat: { text: 'පූසා', kana: 'プーサー', romaji: 'Poosa' },
    water: { text: 'ජලය', kana: 'ජලය', romaji: 'Jalaya' }
  },
  ne: {
    hello: { text: 'नमस्ते', kana: 'ナマステ', romaji: 'Namaste' },
    thank_you: { text: 'धन्यवाद', kana: 'ダンニャワード', romaji: 'Dhanyavaad' },
    delicious: { text: 'मिठो', kana: 'ミト', romaji: 'Mitho' },
    good_night: { text: 'शुभ रात्रि', kana: 'シュブ・ラートリ', romaji: 'Shubh raatri' },
    love_you: { text: 'म तिमीलाई माया गर्छु', kana: 'マ・ティミライ・マヤ・ガルチュ', romaji: 'Ma timilai maya garchu' },
    sun: { text: 'सूर्य', kana: 'Surya', romaji: 'Surya' },
    star: { text: 'तारा', kana: 'ターラー', romaji: 'Tara' },
    dog: { text: 'कुकुर', kana: 'ククール', romaji: 'Kukur' },
    cat: { text: 'बिरालो', kana: 'ビラロ', romaji: 'Biralo' },
    water: { text: 'पानी', kana: 'Pani', romaji: 'Pani' }
  },
  mn: {
    hello: { text: 'Сайн уу', kana: 'サイノー', romaji: 'Sain uu' },
    thank_you: { text: 'Баярлалаа', kana: 'バヤルララー', romaji: 'Bayarlalaa' },
    delicious: { text: 'Амттай', kana: 'アムッタィ', romaji: 'Amttai' },
    good_night: { text: 'Сайхан амраарай', kana: 'サイハン・アムラーレイ', romaji: 'Saixan amraarai' },
    love_you: { text: 'Би чамд хайртай', kana: 'ビ・チャムド・ハイールタイ', romaji: 'Bi chamd khairtai' },
    sun: { text: 'Нар', kana: 'ナル', romaji: 'Nar' },
    star: { text: 'Од', kana: 'オド', romaji: 'Od' },
    dog: { text: 'Нохой', kana: 'ノホイ', romaji: 'Nokhoi' },
    cat: { text: 'Муур', kana: 'ムール', romaji: 'Muur' },
    water: { text: 'Ус', kana: 'ウス', romaji: 'Us' }
  },
  tr: {
    hello: { text: 'Merhaba', kana: 'メルハバ', romaji: 'Merhaba' },
    thank_you: { text: 'Teşekkürler', kana: 'テシェッキュレル', romaji: 'Tesekkurler' },
    delicious: { text: 'Lezzetli', kana: 'レゼトリ', romaji: 'Lezzetli' },
    good_night: { text: 'İyi geceler', kana: 'イイ・ゲジェレル', romaji: 'Iyi geceler' },
    love_you: { text: 'Seni seviyorum', kana: 'セニ・セヴィヨルム', romaji: 'Seni seviyorum' },
    sun: { text: 'Güneş', kana: 'ギュネシュ', romaji: 'Gunes' },
    star: { text: 'Yıldız', kana: 'ユルドゥズ', romaji: 'Yildiz' },
    dog: { text: 'Köpek', kana: 'キョペッキ', romaji: 'Kopek' },
    cat: { text: 'Kedi', kana: 'ケディ', romaji: 'Kedi' },
    water: { text: 'Su', kana: 'Su', romaji: 'Su' }
  },
  nl: {
    hello: { text: 'Hallo', kana: 'ハロー', romaji: 'Hallo' },
    thank_you: { text: 'Dank je', kana: 'ダンキェ', romaji: 'Dank je' },
    delicious: { text: 'Heerlijk', kana: 'ヘールリック', romaji: 'Heerlijk' },
    good_night: { text: 'Welterusten', kana: 'ウェルテリュステン', romaji: 'Welterusten' },
    love_you: { text: 'Ik hou van jou', kana: 'イク・ハウ・ファン・ヤウ', romaji: 'Ik hou van jou' },
    sun: { text: 'Zon', kana: 'ゾン', romaji: 'Zon' },
    star: { text: 'Ster', kana: 'ステル', romaji: 'Ster' },
    dog: { text: 'Hond', kana: 'ホント', romaji: 'Hond' },
    cat: { text: 'Kat', kana: 'カット', romaji: 'Kat' },
    water: { text: 'Water', kana: 'Water', romaji: 'Water' }
  },
  pl: {
    hello: { text: 'Cześć', kana: 'チェシチ', romaji: 'Czesc' },
    thank_you: { text: 'Dziękuję', kana: 'ジェンクイェ', romaji: 'Dziekuje' },
    delicious: { text: 'Pyszne', kana: 'プィシュネ', romaji: 'Pyszne' },
    good_night: { text: 'Dobranoc', kana: 'ドブラノツ', romaji: 'Dobranoc' },
    love_you: { text: 'Kocham cię', kana: 'コハム・チェ', romaji: 'Kocham cie' },
    sun: { text: 'Słońce', kana: 'スウォンツェ', romaji: 'Slonce' },
    star: { text: 'Gwiazda', kana: 'グヴィアズダ', romaji: 'Gwiazda' },
    dog: { text: 'Pies', kana: 'ピェス', romaji: 'Pies' },
    cat: { text: 'Kot', kana: 'コト', romaji: 'Kot' },
    water: { text: 'Woda', kana: 'Woda', romaji: 'Woda' }
  },
  sv: {
    hello: { text: 'Hej', kana: 'ヘイ', romaji: 'Hej' },
    thank_you: { text: 'Tack', kana: 'タック', romaji: 'Tack' },
    delicious: { text: 'Läckert', kana: 'レッケルト', romaji: 'Lackert' },
    good_night: { text: 'God natt', kana: 'ゴド・ナット', romaji: 'God natt' },
    love_you: { text: 'Jag älskar dig', kana: 'ヤー・エルスカル・デイ', romaji: 'Jag alskar dig' },
    sun: { text: 'Sol', kana: 'ソル', romaji: 'Sol' },
    star: { text: 'Stjärna', kana: 'シュティエールナ', romaji: 'Stjarna' },
    dog: { text: 'Hund', kana: 'フント', romaji: 'Hund' },
    cat: { text: 'Katt', kana: 'カット', romaji: 'Katt' },
    water: { text: 'Vatten', kana: 'Vatten', romaji: 'Vatten' }
  },
  fi: {
    hello: { text: 'Hei', kana: 'ヘイ', romaji: 'Hei' },
    thank_you: { text: 'Kiitos', kana: 'キートス', romaji: 'Kiitos' },
    delicious: { text: 'Herkullista', kana: 'ヘルクッリスタ', romaji: 'Herkullista' },
    good_night: { text: 'Hyvää yötä', kana: 'ヒュヴァー・ウオタ', romaji: 'Hyvaa yota' },
    love_you: { text: 'Minä rakastan sinua', kana: 'ミナ・ラカスタン・シヌア', romaji: 'Mina rakastan sinua' },
    sun: { text: 'Aurinko', kana: 'アウリンコ', romaji: 'Aurinko' },
    star: { text: 'Tähti', kana: 'タフティ', romaji: 'Tahti' },
    dog: { text: 'Koira', kana: 'コイラ', romaji: 'Koira' },
    cat: { text: 'Kissa', kana: 'キッサ', romaji: 'Kissa' },
    water: { text: 'Vesi', kana: 'Vesi', romaji: 'Vesi' }
  },
  cs: {
    hello: { text: 'Ahoj', kana: 'アホイ', romaji: 'Ahoj' },
    thank_you: { text: 'Děkuji', kana: 'ジェくいェ', romaji: 'Dekuji' },
    delicious: { text: 'Lahodný', kana: 'ラホドニィ', romaji: 'Lahodny' },
    good_night: { text: 'Dobrou noc', kana: 'ドブロウ・ノツ', romaji: 'Dobrou noc' },
    love_you: { text: 'Miluji tě', kana: 'ミルイェ・チェ', romaji: 'Miluji te' },
    sun: { text: 'Slunce', kana: 'スルンツェ', romaji: 'Slunce' },
    star: { text: 'Hvězda', kana: 'フヴィェズダ', romaji: 'Hvezda' },
    dog: { text: 'Pes', kana: 'ペス', romaji: 'Pes' },
    cat: { text: 'Kočka', kana: 'コチュカ', romaji: 'Kocka' },
    water: { text: 'Voda', kana: 'Voda', romaji: 'Voda' }
  },
  id: {
    hello: { text: 'Halo', kana: 'Halo', romaji: 'Halo' },
    thank_you: { text: 'Terima kasih', kana: 'テリマカシ', romaji: 'Terima kasih' },
    delicious: { text: 'Lezat', kana: 'レザット', romaji: 'Lezat' },
    good_night: { text: 'Selamat tidur', kana: 'スラマット・ティドゥール', romaji: 'Selamat tidur' },
    love_you: { text: 'Aku cinta kamu', kana: 'アク・チンタ・カム', romaji: 'Aku cinta kamu' },
    sun: { text: 'Matahari', kana: 'マタハリ', romaji: 'Matahari' },
    star: { text: 'Bintang', kana: 'ビンタン', romaji: 'Bintang' },
    dog: { text: 'Anjing', kana: 'アンジン', romaji: 'Anjing' },
    cat: { text: 'Kucing', kana: 'クチン', romaji: 'Kucing' },
    water: { text: 'Air', kana: 'Air', romaji: 'Air' }
  },
  ms: {
    hello: { text: 'Hello', kana: 'ハロー', romaji: 'Hello' },
    thank_you: { text: 'Terima kasih', kana: 'テリマカシ', romaji: 'Terima kasih' },
    delicious: { text: 'Lazat', kana: 'ラザット', romaji: 'Lazat' },
    good_night: { text: 'Selamat malam', kana: 'スラマット・マラム', romaji: 'Selamat malam' },
    love_you: { text: 'Saya sayang kamu', kana: 'サヤ・サヤン・カム', romaji: 'Saya sayang kamu' },
    sun: { text: 'Matahari', kana: 'マタハリ', romaji: 'Matahari' },
    star: { text: 'Bintang', kana: 'ビンタン', romaji: 'Bintang' },
    dog: { text: 'Anjing', kana: 'アンジン', romaji: 'Anjing' },
    cat: { text: 'Kucing', kana: 'クチン', romaji: 'Kucing' },
    water: { text: 'Air', kana: 'Air', romaji: 'Air' }
  },
  fil: {
    hello: { text: 'Kamusta', kana: 'カムスタ', romaji: 'Kamusta' },
    thank_you: { text: 'Salamat', kana: 'サラマット', romaji: 'Salamat' },
    delicious: { text: 'Masarap', kana: 'マサラップ', romaji: 'Masarap' },
    good_night: { text: 'Magandang gabi', kana: 'マガンダン・ガビ', romaji: 'Magandang gabi' },
    love_you: { text: 'Mahal kita', kana: 'マハル・キタ', romaji: 'Mahal kita' },
    sun: { text: 'Araw', kana: 'アラウ', romaji: 'Araw' },
    star: { text: 'Bituin', kana: 'ビトゥイン', romaji: 'Bituin' },
    dog: { text: 'Aso', kana: 'アソ', romaji: 'Aso' },
    cat: { text: 'Pusa', kana: 'プサ', romaji: 'Pusa' },
    water: { text: 'Tubig', kana: 'Tubig', romaji: 'Tubig' }
  },
  sw: {
    hello: { text: 'Jambo', kana: 'ジャンボ', romaji: 'Jambo' },
    thank_you: { text: 'Asante', kana: 'アサンテ', romaji: 'Asante' },
    delicious: { text: 'Tamu', kana: 'タム', romaji: 'Tamu' },
    good_night: { text: 'Usiku mwema', kana: 'ウシク・ムウェマ', romaji: 'Usiku mwema' },
    love_you: { text: 'Nakupenda', kana: 'ナクペンダ', romaji: 'Nakupenda' },
    sun: { text: 'Jua', kana: 'ジュア', romaji: 'Jua' },
    star: { text: 'Nyota', kana: 'ニョタ', romaji: 'Nyota' },
    dog: { text: 'Mbwa', kana: 'ムブワ', romaji: 'Mbwa' },
    cat: { text: 'Paka', kana: 'パカ', romaji: 'Paka' },
    water: { text: 'Maji', kana: 'マヂ', romaji: 'Maji' }
  }
};

function App() {
  const [activeTab, setActiveTab] = useState('soundboard'); // 'soundboard', 'matching'
  
  // サウンドボード状態
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [selectedWordId, setSelectedWordId] = useState('hello');
  const [speechRate, setSpeechRate] = useState(0.85);

  // マッチングゲーム（かたちあわせ）状態
  const [gameState, setGameState] = useState('playing'); // 'playing', 'celebrating'
  const [currentStep, setCurrentStep] = useState(0); // 0〜4
  const [targetItem, setTargetItem] = useState(null); // { text, langCode, flag, wordId }
  const [choices, setChoices] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isCorrectChoice, setIsCorrectChoice] = useState(null);
  
  const [sparkles, setSparkles] = useState([]);
  const voicesRef = useRef([]);

  // 音声エンジンの読み込み
  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        voicesRef.current = window.speechSynthesis.getVoices();
      }
    };
    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Web Audio APIによる効果音合成
  const playSfx = (isCorrect) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      if (isCorrect) {
        // C5 -> E5 -> G5
        const notes = [523.25, 659.25, 783.99];
        notes.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + index * 0.08);
          gain.gain.setValueAtTime(0.08, now + index * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + index * 0.08);
          osc.stop(now + index * 0.08 + 0.25);
        });
      } else {
        // Low Buzz
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.28);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.28);
      }
    } catch (e) {
      console.error('AudioContext error:', e);
    }
  };

  // 発音
  const speakText = (text, langCode) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = speechRate;

    const findVoice = () => {
      let voice = voicesRef.current.find((v) => v.lang === langCode);
      if (voice) return voice;

      const shortLang = langCode.split('-')[0];
      voice = voicesRef.current.find((v) => v.lang.startsWith(shortLang));
      if (voice) return voice;

      return null;
    };

    const targetVoice = findVoice();
    if (targetVoice) utterance.voice = targetVoice;

    window.speechSynthesis.speak(utterance);
  };

  // サウンドボード自動再生
  useEffect(() => {
    if (activeTab === 'soundboard') {
      triggerSoundboardSpeech();
    }
  }, [selectedLang, selectedWordId]);

  const triggerSoundboardSpeech = () => {
    const translation = TRANSLATIONS[selectedLang.id]?.[selectedWordId];
    if (translation) {
      speakText(translation.text, selectedLang.code);
    }
  };

  // マッチングゲーム初期化
  const initMatchingGame = () => {
    setCurrentStep(0);
    setGameState('playing');
    setupMatchingStep(0);
  };

  const setupMatchingStep = (stepIndex) => {
    setSelectedChoice(null);
    setIsCorrectChoice(null);
    setSparkles([]);

    const randomLang = LANGUAGES[Math.floor(Math.random() * LANGUAGES.length)];
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    const correctText = TRANSLATIONS[randomLang.id]?.[randomWord.id]?.text || '';

    const wrongOptions = [];
    while (wrongOptions.length < 2) {
      const wLang = LANGUAGES[Math.floor(Math.random() * LANGUAGES.length)];
      const wWord = WORDS[Math.floor(Math.random() * WORDS.length)];
      const wText = TRANSLATIONS[wLang.id]?.[wWord.id]?.text;
      
      if (wText && wText !== correctText && !wrongOptions.includes(wText)) {
        wrongOptions.push(wText);
      }
    }

    const options = [correctText, ...wrongOptions].sort(() => Math.random() - 0.5);

    const target = {
      text: correctText,
      langCode: randomLang.code,
      flag: randomLang.flag,
      wordId: randomWord.id
    };

    setTargetItem(target);
    setChoices(options);

    setTimeout(() => {
      speakText(target.text, target.langCode);
    }, 200);
  };

  const handleChoiceTap = (choice) => {
    if (selectedChoice !== null) return;

    const isCorrect = choice === targetItem.text;
    setSelectedChoice(choice);
    setIsCorrectChoice(isCorrect);
    playSfx(isCorrect);

    if (isCorrect) {
      const newSparkles = Array.from({ length: 15 }).map((_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 80 - 40,
        y: Math.random() * 80 - 40,
        color: ['#E8C274', '#6DA698', '#6FA2BF', '#DDA084', '#9A8BB8'][Math.floor(Math.random() * 5)]
      }));
      setSparkles(newSparkles);
      
      speakText(targetItem.text, targetItem.langCode);

      setTimeout(() => {
        if (currentStep < 4) {
          setCurrentStep((prev) => prev + 1);
          setupMatchingStep(currentStep + 1);
        } else {
          setGameState('celebrating');
        }
      }, 2000);
    } else {
      setTimeout(() => {
        setSelectedChoice(null);
        setIsCorrectChoice(null);
      }, 1000);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'matching') {
      initMatchingGame();
    }
  };

  return (
    <div className="app-container">
      {/* ヘッダー */}
      <header className="app-header">
        <div className="header-logo" onClick={() => handleTabChange('soundboard')}>
          <span className="logo-icon">🌍</span>
          <h1>Global Voice</h1>
        </div>
        <div className="mode-switcher">
          <button className={`btn-3d switcher-btn ${activeTab === 'soundboard' ? 'active' : ''}`} onClick={() => handleTabChange('soundboard')}>
            <span style={{ fontSize: '1.4rem' }}>📢</span>
            おとをきく
          </button>
          <button className={`btn-3d switcher-btn ${activeTab === 'matching' ? 'active' : ''}`} onClick={() => handleTabChange('matching')}>
            <span style={{ fontSize: '1.4rem' }}>🧩</span>
            かたちあわせ
          </button>
        </div>
      </header>

      {/* メインゲーム盤 */}
      <main className="game-board">
        <AnimatePresence mode="wait">
          {/* 📢 おとをきく */}
          {activeTab === 'soundboard' && (
            <motion.div key="soundboard-view" className="soundboard-layout" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}>
              
              {/* 左：言語リスト */}
              <aside className="lang-selector-sidebar">
                <div className="lang-grid-mini">
                  {LANGUAGES.map((lang) => (
                    <button key={lang.id} className={`lang-card-mini ${selectedLang.id === lang.id ? 'selected' : ''}`} onClick={() => setSelectedLang(lang)}>
                      <span className="flag">{lang.flag}</span>
                      <span className="name">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </aside>

              {/* 右：メイン表示＆スプランキーボタン */}
              <div className="soundboard-main">
                <div className="display-panel-large">
                  <span className="active-flag-badge">{selectedLang.flag}</span>
                  
                  {/* スプランキーキャラクターの巨大表示 */}
                  <div className="active-char-display">
                    <div className={`sprunki-icon-large char-${selectedWordId}`}></div>
                  </div>

                  {/* 外国語の文字 */}
                  <span className="foreign-text-giant">
                    {TRANSLATIONS[selectedLang.id]?.[selectedWordId]?.text}
                  </span>

                  {/* フリガナ */}
                  <span className="pronunciation-sub">
                    「 {TRANSLATIONS[selectedLang.id]?.[selectedWordId]?.kana} 」
                  </span>

                  {/* ローマ字 */}
                  {TRANSLATIONS[selectedLang.id]?.[selectedWordId]?.romaji !== TRANSLATIONS[selectedLang.id]?.[selectedWordId]?.text && (
                    <span className="pronunciation-romaji">
                      ({TRANSLATIONS[selectedLang.id]?.[selectedWordId]?.romaji})
                    </span>
                  )}
                </div>

                {/* 音声コントロール */}
                <div className="controls-bar">
                  <button className="btn-3d btn-speak-giant" onClick={triggerSoundboardSpeech}>
                    <Volume2 size={26} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                    もういちど きく
                  </button>

                  <div className="speed-control">
                    <div className="speed-slider-labels">
                      <span>ゆっくり</span>
                      <span>ふつう</span>
                    </div>
                    <input type="range" min="0.4" max="1.0" step="0.05" value={speechRate} className="slider-custom" onChange={(e) => setSpeechRate(parseFloat(e.target.value))} />
                  </div>
                </div>

                {/* スプランキーキャラクターの選択ボタン */}
                <div className="emoji-words-grid">
                  {WORDS.map((w) => (
                    <button key={w.id} className={`btn-3d emoji-word-card ${selectedWordId === w.id ? 'selected' : ''}`} onClick={() => setSelectedWordId(w.id)} title={w.name}>
                      <div className={`sprunki-icon char-${w.id}`}></div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* 🧩 かたちあわせ */}
          {activeTab === 'matching' && (
            <motion.div key="matching-view" className="matching-layout" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}>
              {gameState === 'playing' ? (
                <div>
                  {/* お手本カード */}
                  <div className="target-shape-card">
                    {/* お手本キャラクターミニバッジ */}
                    {targetItem && (
                      <div className="target-char-badge">
                        <div className={`sprunki-icon char-${targetItem.wordId}`}></div>
                      </div>
                    )}
                    <span className="target-shape-text">
                      {targetItem?.text}
                    </span>
                    <button className="btn-3d btn-hear-target" onClick={() => speakText(targetItem.text, targetItem.langCode)}>
                      <Volume2 size={24} />
                    </button>
                  </div>

                  {/* 星メーター */}
                  <div className="progress-stars-bar">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`star-icon ${i < currentStep ? 'active' : 'inactive'}`}>
                        ★
                      </span>
                    ))}
                  </div>

                  <p style={{ margin: '1.5rem 0 1rem 0', fontSize: '1.2rem', fontWeight: '700', color: 'var(--color-text-light)' }}>
                    おなじ かたちの 文字を えらんでね 👇
                  </p>

                  {/* 3つの選択肢 */}
                  <div className="choice-cards-grid">
                    {choices.map((choice, index) => {
                      const isSelected = selectedChoice === choice;
                      
                      let choiceClass = "";
                      if (selectedChoice !== null) {
                        if (choice === targetItem.text) choiceClass = "correct";
                        else if (isSelected) choiceClass = "wrong";
                      }

                      return (
                        <button key={index} className={`btn-3d choice-card ${choiceClass}`} onClick={() => handleChoiceTap(choice)} disabled={selectedChoice !== null && !isSelected}>
                          <span className="choice-card-text">{choice}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* 星のスパークル */}
                  {sparkles.map((sp) => (
                    <motion.div key={sp.id} initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }} animate={{ x: sp.x * 3.5, y: sp.y * 3.5 - 40, opacity: 0, scale: 1.6, rotate: 180 }} transition={{ duration: 1.4, ease: 'easeOut' }} style={{ position: 'fixed', left: '50%', top: '35%', color: sp.color, pointerEvents: 'none', zIndex: 1000, fontSize: '2.5rem' }}>
                      ✦
                    </motion.div>
                  ))}
                </div>
              ) : (
                /* 全問クリア・お祝い */
                <div className="celebration-card">
                  <span className="gold-star-badge">🏆</span>
                  <div className="celebration-text">
                    <span className="celebration-title">できた！できた！</span>
                    <p style={{ fontSize: '1.3rem', color: 'var(--color-text-light)', marginTop: '0.8rem' }}>
                      ぜんぶの パズルが かんせいしたよ！
                    </p>
                  </div>
                  <button className="btn-3d btn-next-level" onClick={initMatchingGame}>
                    <RefreshCw size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    もういちど あそぶ
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
