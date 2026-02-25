import { useState, useEffect } from "react";

/* ============================================================
   SHARED STYLES & UTILS
   ============================================================ */
const FONTS_LINK = "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Cinzel:wght@400;500;600;700&display=swap";

const GLOBAL_CSS = `
  @keyframes shake { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-6px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(139,90,43,0.1); } 50% { box-shadow: 0 0 40px rgba(139,90,43,0.2); } }
  @keyframes celebrateIn { 0% { opacity: 0; transform: scale(0.8) translateY(20px); } 60% { transform: scale(1.05) translateY(-4px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
  @keyframes pulse { 0%, 100% { border-color: rgba(139,90,43,0.5); } 50% { border-color: rgba(139,90,43,0.2); } }
  @keyframes revealIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes countIn { from { transform: scale(1.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .cross-pattern { position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.03; pointer-events: none; background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M18 0h4v18h18v4H22v18h-4V22H0v-4h18V0z' fill='%235a3a1a'/%3E%3C/svg%3E"); }
  * { -webkit-tap-highlight-color: transparent; }
`;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function AppShell({ children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", background: "linear-gradient(170deg, #fdf6e3 0%, #f5e6c8 35%, #eddcb3 65%, #e8d4a4 100%)", fontFamily: "'EB Garamond', serif", position: "relative", overflow: "hidden" }}>
      <link href={FONTS_LINK} rel="stylesheet" />
      <style>{GLOBAL_CSS}</style>
      <div className="cross-pattern" />
      {children}
    </div>
  );
}

function BackButton({ onClick }) {
  return <button onClick={onClick} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'EB Garamond', serif", fontSize: 16, color: "#8b6930", padding: "6px 12px", borderRadius: 8 }}>← Back</button>;
}

const OT_VERSES = [
  { ref: "Genesis 1:1", text: "In the beginning God made the heaven and the earth", testament: "OT" },
  { ref: "Genesis 1:3", text: "And God said Let there be light and there was light", testament: "OT" },
  { ref: "Genesis 1:27", text: "And God made man according to the image of God he made him male and female he made them", testament: "OT" },
  { ref: "Genesis 1:31", text: "And God saw all the things that he had made and behold they were very good", testament: "OT" },
  { ref: "Genesis 2:7", text: "And God formed the man of dust of the earth and breathed upon his face the breath of life and the man became a living soul", testament: "OT" },
  { ref: "Genesis 3:15", text: "And I will put enmity between you and the woman and between your seed and her seed he shall watch against your head and you shall watch against his heel", testament: "OT" },
  { ref: "Genesis 12:2", text: "And I will make you a great nation and I will bless you and magnify your name and you shall be blessed", testament: "OT" },
  { ref: "Genesis 15:6", text: "And Abram believed God and it was counted to him for righteousness", testament: "OT" },
  { ref: "Genesis 28:15", text: "And behold I am with you keeping you in all the way in which you shall go", testament: "OT" },
  { ref: "Genesis 50:20", text: "You devised evil against me but God devised it for good so that it should come to pass as it is today and much people should be fed", testament: "OT" },
  { ref: "Exodus 3:14", text: "And God spoke to Moses saying I am the one who is", testament: "OT" },
  { ref: "Exodus 14:14", text: "The Lord shall fight for you and you shall hold your peace", testament: "OT" },
  { ref: "Exodus 15:2", text: "The Lord is my strength and my song and he is become my salvation", testament: "OT" },
  { ref: "Exodus 20:2-3", text: "I am the Lord your God who brought you out of the land of Egypt you shall have no other gods beside me", testament: "OT" },
  { ref: "Deuteronomy 6:4-5", text: "Hear O Israel the Lord our God is one Lord and you shall love the Lord your God with all your mind and with all your soul and with all your strength", testament: "OT" },
  { ref: "Deuteronomy 31:6", text: "Be courageous and strong fear not nor be afraid of them for the Lord your God who goes with you he will not forsake you nor abandon you", testament: "OT" },
  { ref: "Deuteronomy 31:8", text: "And the Lord that goes with you shall not forsake you nor abandon you fear not neither be cowardly", testament: "OT" },
  { ref: "Joshua 1:9", text: "Be strong and courageous be not cowardly nor fearful for the Lord your God is with you in every place wherever you go", testament: "OT" },
  { ref: "Psalm 1:1-2", text: "Blessed is the man who has not walked in the counsel of the ungodly but his will is in the law of the Lord and in his law will he meditate day and night", testament: "OT" },
  { ref: "Psalm 16:8 (LXX 15:8)", text: "I foresaw the Lord always before my face for he is at my right hand that I should not be shaken", testament: "OT" },
  { ref: "Psalm 18:1 (LXX 17:1)", text: "I will love you O Lord my strength the Lord is my firm support and my refuge and my deliverer", testament: "OT" },
  { ref: "Psalm 19:1 (LXX 18:1)", text: "The heavens declare the glory of God and the firmament proclaims the work of his hands", testament: "OT" },
  { ref: "Psalm 22:1 (LXX 21:1)", text: "O God my God attend to me why have you forsaken me", testament: "OT" },
  { ref: "Psalm 23:1-3 (LXX 22)", text: "The Lord is my shepherd I shall not want he makes me to lie down in green pasture he leads me beside the still water he restores my soul", testament: "OT" },
  { ref: "Psalm 23:4 (LXX 22)", text: "Even though I walk through the valley of the shadow of death I will fear no evil for you are with me your rod and your staff they comfort me", testament: "OT" },
  { ref: "Psalm 27:1 (LXX 26:1)", text: "The Lord is my light and my savior whom shall I fear the Lord is the defender of my life of whom shall I be afraid", testament: "OT" },
  { ref: "Psalm 32:1 (LXX 31:1)", text: "Blessed are they whose transgressions are forgiven and whose sins are covered", testament: "OT" },
  { ref: "Psalm 34:8 (LXX 33:8)", text: "O taste and see that the Lord is good blessed is the man that hopes in him", testament: "OT" },
  { ref: "Psalm 37:4 (LXX 36:4)", text: "Delight yourself in the Lord and he shall grant you the requests of your heart", testament: "OT" },
  { ref: "Psalm 46:1 (LXX 45:1)", text: "God is our refuge and strength a help in afflictions that have found us exceedingly", testament: "OT" },
  { ref: "Psalm 46:10 (LXX 45:10)", text: "Be still and know that I am God I will be exalted among the nations I will be exalted in the earth", testament: "OT" },
  { ref: "Psalm 51:10 (LXX 50:10)", text: "Create in me a clean heart O God and renew a right spirit within me", testament: "OT" },
  { ref: "Psalm 51:17 (LXX 50:17)", text: "A sacrifice to God is a broken spirit a broken and humbled heart God will not despise", testament: "OT" },
  { ref: "Psalm 90:2 (LXX 89:2)", text: "Before the mountains were brought forth or ever the earth and the world were formed even from age to age you are God", testament: "OT" },
  { ref: "Psalm 91:1-2 (LXX 90)", text: "He that dwells in the help of the Most High shall sojourn under the shelter of the God of heaven", testament: "OT" },
  { ref: "Psalm 91:11 (LXX 90:11)", text: "For he shall give his angels charge over you to keep you in all your ways", testament: "OT" },
  { ref: "Psalm 100:3 (LXX 99:3)", text: "Know that the Lord he is God he made us and not we ourselves we are his people and the sheep of his pasture", testament: "OT" },
  { ref: "Psalm 103:1-2 (LXX 102)", text: "Bless the Lord O my soul and all that is within me bless his holy name bless the Lord O my soul and forget not all his rewards", testament: "OT" },
  { ref: "Psalm 118:6 (LXX 117:6)", text: "The Lord is my helper and I will not fear what shall man do to me", testament: "OT" },
  { ref: "Psalm 119:11 (LXX 118:11)", text: "In my heart I have hidden your words that I might not sin against you", testament: "OT" },
  { ref: "Psalm 119:105 (LXX 118:105)", text: "Your law is a lamp to my feet and a light to my paths", testament: "OT" },
  { ref: "Psalm 121:1-2 (LXX 120)", text: "I lifted up my eyes to the mountains from where shall my help come my help shall come from the Lord who made heaven and earth", testament: "OT" },
  { ref: "Psalm 136:1 (LXX 135:1)", text: "Give thanks to the Lord for he is good for his mercy endures forever", testament: "OT" },
  { ref: "Psalm 139:14 (LXX 138:14)", text: "I will give thanks to you for I am fearfully and wonderfully made wonderful are your works and my soul knows it well", testament: "OT" },
  { ref: "Psalm 145:18 (LXX 144:18)", text: "The Lord is near to all that call upon him to all that call upon him in truth", testament: "OT" },
  { ref: "Psalm 150:6", text: "Let everything that has breath praise the Lord", testament: "OT" },
  { ref: "Psalm 2:7 (LXX 2:7)", text: "The Lord said to me You are my Son this day have I begotten you", testament: "OT" },
  { ref: "Psalm 2:11-12 (LXX 2:11)", text: "Serve the Lord with fear and rejoice in him with trembling", testament: "OT" },
  { ref: "Psalm 3:3 (LXX 3:4)", text: "But you O Lord are my helper my glory and the one that lifts up my head", testament: "OT" },
  { ref: "Psalm 4:8 (LXX 4:9)", text: "I will both lie down in peace and sleep for you alone O Lord make me to dwell in safety", testament: "OT" },
  { ref: "Psalm 5:3 (LXX 5:4)", text: "In the morning you shall hear my voice in the morning will I stand before you and you will look upon me", testament: "OT" },
  { ref: "Psalm 6:2 (LXX 6:3)", text: "Have mercy on me O Lord for I am weak heal me O Lord for my bones are troubled", testament: "OT" },
  { ref: "Psalm 8:1 (LXX 8:2)", text: "O Lord our Lord how wonderful is your name in all the earth for your magnificence is exalted above the heavens", testament: "OT" },
  { ref: "Psalm 8:3-4 (LXX 8:4-5)", text: "When I look at the heavens the works of your fingers the moon and the stars which you have established what is man that you are mindful of him", testament: "OT" },
  { ref: "Psalm 9:1-2 (LXX 9:2-3)", text: "I will give thanks to you O Lord with my whole heart I will recount all your wonderful works I will be glad and rejoice in you", testament: "OT" },
  { ref: "Psalm 10:17 (LXX 9:38)", text: "O Lord you have heard the desire of the poor your ear has attended to the preparation of their heart", testament: "OT" },
  { ref: "Psalm 11:7 (LXX 10:7)", text: "For the Lord is righteous and loves righteousness his face beholds uprightness", testament: "OT" },
  { ref: "Psalm 13:5-6 (LXX 12:6)", text: "But I have hoped in your mercy my heart shall rejoice in your salvation I will sing to the Lord who has dealt bountifully with me", testament: "OT" },
  { ref: "Psalm 14:1 (LXX 13:1)", text: "The fool has said in his heart there is no God they have corrupted themselves and become abominable in their practices", testament: "OT" },
  { ref: "Psalm 16:11 (LXX 15:11)", text: "You have made known to me the paths of life you will fill me with gladness with your countenance", testament: "OT" },
  { ref: "Psalm 17:8 (LXX 16:8)", text: "Keep me as the apple of your eye in the shelter of your wings you will hide me", testament: "OT" },
  { ref: "Psalm 18:2 (LXX 17:2)", text: "The Lord is my firm support and my refuge and my deliverer my God is my helper and I will hope in him", testament: "OT" },
  { ref: "Psalm 19:7 (LXX 18:8)", text: "The law of the Lord is perfect converting souls the testimony of the Lord is faithful making wise the simple", testament: "OT" },
  { ref: "Psalm 19:14 (LXX 18:15)", text: "Let the words of my mouth and the meditation of my heart be acceptable before you O Lord my helper and my redeemer", testament: "OT" },
  { ref: "Psalm 20:7 (LXX 19:8)", text: "Some trust in chariots and some in horses but we will call upon the name of the Lord our God", testament: "OT" },
  { ref: "Psalm 22:3 (LXX 21:4)", text: "But you dwell among the holy ones O praise of Israel", testament: "OT" },
  { ref: "Psalm 23:5-6 (LXX 22)", text: "You have prepared a table before me in the presence of those who afflict me you have anointed my head with oil and your mercy shall follow me all the days of my life", testament: "OT" },
  { ref: "Psalm 24:1 (LXX 23:1)", text: "The earth is the Lord's and the fullness thereof the world and all that dwell in it", testament: "OT" },
  { ref: "Psalm 25:4-5 (LXX 24:4-5)", text: "Show me your ways O Lord and teach me your paths lead me in your truth and teach me for you are the God of my salvation", testament: "OT" },
  { ref: "Psalm 26:8 (LXX 25:8)", text: "O Lord I have loved the beauty of your house and the place of the tabernacle of your glory", testament: "OT" },
  { ref: "Psalm 27:4 (LXX 26:4)", text: "One thing I have asked of the Lord this will I seek after that I should dwell in the house of the Lord all the days of my life", testament: "OT" },
  { ref: "Psalm 27:14 (LXX 26:14)", text: "Wait on the Lord be of good courage and let your heart be strengthened and wait on the Lord", testament: "OT" },
  { ref: "Psalm 28:7 (LXX 27:7)", text: "The Lord is my helper and my shield my heart has hoped in him and I am helped and my flesh has revived", testament: "OT" },
  { ref: "Psalm 29:2 (LXX 28:2)", text: "Bring to the Lord glory and honor bring to the Lord glory to his name worship the Lord in his holy court", testament: "OT" },
  { ref: "Psalm 30:5 (LXX 29:6)", text: "For anger is in his wrath and life in his favor weeping shall tarry for the evening but joy shall come in the morning", testament: "OT" },
  { ref: "Psalm 30:11-12 (LXX 29:12)", text: "You have turned my mourning into joy for me you have torn off my sackcloth and girded me with gladness", testament: "OT" },
  { ref: "Psalm 31:24 (LXX 30:25)", text: "Be of good courage and let your heart be strengthened all you that hope in the Lord", testament: "OT" },
  { ref: "Psalm 33:4-5 (LXX 32:4-5)", text: "For the word of the Lord is right and all his works are faithful he loves mercy and judgment the earth is full of the mercy of the Lord", testament: "OT" },
  { ref: "Psalm 33:12 (LXX 32:12)", text: "Blessed is the nation whose God is the Lord the people whom he has chosen for his own inheritance", testament: "OT" },
  { ref: "Psalm 34:1 (LXX 33:1)", text: "I will bless the Lord at all times his praise shall continually be in my mouth", testament: "OT" },
  { ref: "Psalm 34:4 (LXX 33:4)", text: "I sought the Lord and he hearkened to me and delivered me from all my afflictions", testament: "OT" },
  { ref: "Psalm 34:18 (LXX 33:18)", text: "The Lord is near to them that are of a contrite heart and will save the lowly in spirit", testament: "OT" },
  { ref: "Psalm 36:5-6 (LXX 35:6-7)", text: "O Lord your mercy is in the heaven and your truth reaches to the clouds your righteousness is as the mountains of God", testament: "OT" },
  { ref: "Psalm 37:5 (LXX 36:5)", text: "Disclose your way to the Lord and hope in him and he will bring it to pass", testament: "OT" },
  { ref: "Psalm 37:7 (LXX 36:7)", text: "Submit yourself to the Lord and supplicate him fret not yourself because of him that prospers in his way", testament: "OT" },
  { ref: "Psalm 37:23-24 (LXX 36:23-24)", text: "The steps of a man are rightly ordered by the Lord and he will delight in his way when he falls he shall not be utterly broken for the Lord supports his hand", testament: "OT" },
  { ref: "Psalm 38:15 (LXX 37:16)", text: "For in you O Lord have I hoped you will hear O Lord my God", testament: "OT" },
  { ref: "Psalm 39:7 (LXX 38:8)", text: "And now what is my expectation is it not the Lord and my substance is from you", testament: "OT" },
  { ref: "Psalm 40:1-2 (LXX 39:1-2)", text: "I waited patiently for the Lord and he attended to me and hearkened to my supplication", testament: "OT" },
  { ref: "Psalm 40:8 (LXX 39:9)", text: "I desired to do your will O my God and your law in the midst of my heart", testament: "OT" },
  { ref: "Psalm 42:1-2 (LXX 41:1-2)", text: "As the deer longs for the fountains of water so my soul longs for you O God my soul has thirsted for the living God", testament: "OT" },
  { ref: "Psalm 42:5 (LXX 41:6)", text: "Why are you very sad O my soul and why do you trouble me hope in God for I will give thanks to him the salvation of my countenance", testament: "OT" },
  { ref: "Psalm 42:11 (LXX 41:12)", text: "Why are you cast down O my soul and why do you trouble me hope in God for I will give thanks to him who is the health of my countenance and my God", testament: "OT" },
  { ref: "Psalm 43:3 (LXX 42:3)", text: "Send forth your light and your truth they have led me and brought me to your holy mountain and to your tabernacles", testament: "OT" },
  { ref: "Psalm 46:5 (LXX 45:5)", text: "God is in the midst of her she shall not be moved God shall help her early in the morning", testament: "OT" },
  { ref: "Psalm 47:1 (LXX 46:2)", text: "Clap your hands all you nations shout to God with a voice of rejoicing", testament: "OT" },
  { ref: "Psalm 48:1 (LXX 47:2)", text: "Great is the Lord and greatly to be praised in the city of our God in his holy mountain", testament: "OT" },
  { ref: "Psalm 50:15 (LXX 49:15)", text: "And call upon me in the day of affliction and I will deliver you and you shall glorify me", testament: "OT" },
  { ref: "Psalm 51:1-2 (LXX 50:1-2)", text: "Have mercy upon me O God according to your great mercy and according to the multitude of your compassions blot out my transgression", testament: "OT" },
  { ref: "Psalm 55:22 (LXX 54:23)", text: "Cast your care upon the Lord and he shall sustain you he shall never suffer the righteous to be moved", testament: "OT" },
  { ref: "Psalm 56:3-4 (LXX 55:3-4)", text: "In the day when I am afraid I will hope in you in God I will praise my words in God I have hoped I will not fear what shall flesh do to me", testament: "OT" },
  { ref: "Psalm 57:10 (LXX 56:11)", text: "For your mercy is magnified even to the heavens and your truth to the clouds", testament: "OT" },
  { ref: "Psalm 59:16 (LXX 58:17)", text: "But I will sing of your strength and I will exalt your mercy in the morning for you have been my defender and my refuge in the day of my affliction", testament: "OT" },
  { ref: "Psalm 61:2 (LXX 60:3)", text: "From the ends of the earth I have cried to you when my heart was in trouble you lifted me up on a rock", testament: "OT" },
  { ref: "Psalm 62:1-2 (LXX 61:2-3)", text: "Shall not my soul be subject to God for from him is my salvation for he is my God and my savior my helper I shall not be moved much", testament: "OT" },
  { ref: "Psalm 63:1 (LXX 62:2)", text: "O God my God I cry to you early my soul has thirsted for you how often has my flesh thirsted for you in a desert land", testament: "OT" },
  { ref: "Psalm 63:3 (LXX 62:4)", text: "For your mercy is better than life my lips shall praise you", testament: "OT" },
  { ref: "Psalm 65:11 (LXX 64:12)", text: "You will bless the crown of the year of your goodness and your plains shall be filled with fatness", testament: "OT" },
  { ref: "Psalm 66:1-2 (LXX 65:1-2)", text: "Shout with joy to God all the earth sing praise to his name give glory to his praise", testament: "OT" },
  { ref: "Psalm 67:1 (LXX 66:2)", text: "God be merciful to us and bless us and cause his face to shine upon us", testament: "OT" },
  { ref: "Psalm 68:5-6 (LXX 67:6)", text: "A father of orphans and a judge of widows is God in his holy place God settles the solitary in a house", testament: "OT" },
  { ref: "Psalm 69:30 (LXX 68:31)", text: "I will praise the name of God with a song I will magnify him with praise", testament: "OT" },
  { ref: "Psalm 71:5-6 (LXX 70:5-6)", text: "For you are my hope O Lord the Lord is my hope from my youth from the womb you have been my protector", testament: "OT" },
  { ref: "Psalm 72:18-19 (LXX 71:18-19)", text: "Blessed be the Lord the God of Israel who alone does wondrous things and blessed be his glorious name forever", testament: "OT" },
  { ref: "Psalm 73:25-26 (LXX 72:25-26)", text: "Whom have I in heaven but you and what have I desired upon the earth beside you my heart and my flesh have failed but God is the strength of my heart and God is my portion forever", testament: "OT" },
  { ref: "Psalm 77:11-12 (LXX 76:12)", text: "I remembered the works of the Lord for I will remember your wonders from the beginning and I will meditate on all your works", testament: "OT" },
  { ref: "Psalm 84:1-2 (LXX 83:2-3)", text: "How lovely are your tabernacles O Lord of hosts my soul longs and faints for the courts of the Lord", testament: "OT" },
  { ref: "Psalm 84:10 (LXX 83:11)", text: "For one day in your courts is better than thousands I would rather be a doorkeeper in the house of God than dwell in the tents of sinners", testament: "OT" },
  { ref: "Psalm 84:11 (LXX 83:12)", text: "For the Lord God loves mercy and truth he will give grace and glory the Lord will not withhold good things from them that walk in innocence", testament: "OT" },
  { ref: "Psalm 85:10-11 (LXX 84:11-12)", text: "Mercy and truth are met together righteousness and peace have kissed each other truth has sprung out of the earth and righteousness has looked down from heaven", testament: "OT" },
  { ref: "Psalm 86:5 (LXX 85:5)", text: "For you O Lord are kind and gentle and plenteous in mercy to all that call upon you", testament: "OT" },
  { ref: "Psalm 86:15 (LXX 85:15)", text: "But you O Lord are a God of compassion and merciful long-suffering and plenteous in mercy and true", testament: "OT" },
  { ref: "Psalm 89:1 (LXX 88:2)", text: "I will sing of your mercies O Lord forever I will declare your truth with my mouth to all generations", testament: "OT" },
  { ref: "Psalm 90:12 (LXX 89:12)", text: "So teach us to number our days that we may apply our hearts to wisdom", testament: "OT" },
  { ref: "Psalm 91:4 (LXX 90:4)", text: "He shall overshadow you with his shoulders and you shall trust under his wings his truth shall cover you with a shield", testament: "OT" },
  { ref: "Psalm 92:1-2 (LXX 91:1-2)", text: "It is a good thing to give thanks to the Lord and to sing praises to your name O Most High to proclaim your mercy in the morning and your truth by night", testament: "OT" },
  { ref: "Psalm 95:1-2 (LXX 94:1-2)", text: "Come let us rejoice in the Lord let us make a joyful noise to God our Savior let us come before his presence with thanksgiving", testament: "OT" },
  { ref: "Psalm 95:6 (LXX 94:6)", text: "Come let us worship and fall down before him and weep before the Lord who made us", testament: "OT" },
  { ref: "Psalm 96:1-2 (LXX 95:1-2)", text: "Sing to the Lord a new song sing to the Lord all the earth sing to the Lord bless his name", testament: "OT" },
  { ref: "Psalm 97:1 (LXX 96:1)", text: "The Lord reigns let the earth rejoice let the many islands be glad", testament: "OT" },
  { ref: "Psalm 100:1-2 (LXX 99:1-2)", text: "Shout joyfully to the Lord all the earth serve the Lord with gladness come before his presence with rejoicing", testament: "OT" },
  { ref: "Psalm 100:5 (LXX 99:5)", text: "For the Lord is good his mercy is forever and his truth endures to all generations", testament: "OT" },
  { ref: "Psalm 103:8 (LXX 102:8)", text: "The Lord is compassionate and merciful longsuffering and plenteous in mercy", testament: "OT" },
  { ref: "Psalm 103:11-12 (LXX 102:11-12)", text: "For as the height of heaven is above the earth so great is his mercy toward them that fear him as far as the east is from the west so far has he removed our transgressions from us", testament: "OT" },
  { ref: "Psalm 103:13 (LXX 102:13)", text: "As a father pities his children so the Lord pities them that fear him", testament: "OT" },
  { ref: "Psalm 104:24 (LXX 103:24)", text: "How great are your works O Lord in wisdom you have wrought them all the earth is filled with your creation", testament: "OT" },
  { ref: "Psalm 105:1-2 (LXX 104:1-2)", text: "Give thanks to the Lord and call upon his name declare his works among the nations sing to him and sing praises to him", testament: "OT" },
  { ref: "Psalm 107:1 (LXX 106:1)", text: "Give thanks to the Lord for he is good for his mercy endures forever", testament: "OT" },
  { ref: "Psalm 107:8-9 (LXX 106:8-9)", text: "Let them give thanks to the Lord for his mercies and his wonderful works to the children of men for he satisfies the empty soul and fills the hungry soul with good things", testament: "OT" },
  { ref: "Psalm 108:5 (LXX 107:5)", text: "Be exalted O God above the heavens and your glory above all the earth", testament: "OT" },
  { ref: "Psalm 111:10 (LXX 110:10)", text: "The fear of the Lord is the beginning of wisdom and all that act accordingly have a good understanding his praise endures forever", testament: "OT" },
  { ref: "Psalm 112:1 (LXX 111:1)", text: "Blessed is the man that fears the Lord he will delight greatly in his commandments", testament: "OT" },
  { ref: "Psalm 113:3 (LXX 112:3)", text: "From the rising of the sun to the going down thereof the name of the Lord is to be praised", testament: "OT" },
  { ref: "Psalm 115:1 (LXX 113:9)", text: "Not to us O Lord not to us but to your name give glory for the sake of your mercy and your truth", testament: "OT" },
  { ref: "Psalm 116:1-2 (LXX 114:1-2)", text: "I am well pleased that the Lord should hearken to the voice of my supplication that he should incline his ear to me", testament: "OT" },
  { ref: "Psalm 118:1 (LXX 117:1)", text: "Give thanks to the Lord for he is good for his mercy endures forever", testament: "OT" },
  { ref: "Psalm 118:24 (LXX 117:24)", text: "This is the day which the Lord has made let us rejoice and be glad in it", testament: "OT" },
  { ref: "Psalm 119:1-2 (LXX 118:1-2)", text: "Blessed are the blameless in the way who walk in the law of the Lord blessed are they that search out his testimonies", testament: "OT" },
  { ref: "Psalm 119:9-10 (LXX 118:9-10)", text: "How shall a young man direct his way by keeping your words with my whole heart have I sought you let me not be rejected from your commandments", testament: "OT" },
  { ref: "Psalm 119:18 (LXX 118:18)", text: "Open my eyes that I may behold wondrous things out of your law", testament: "OT" },
  { ref: "Psalm 119:50 (LXX 118:50)", text: "This has comforted me in my affliction for your word has quickened me", testament: "OT" },
  { ref: "Psalm 119:89-90 (LXX 118:89-90)", text: "Forever O Lord your word abides in heaven your truth endures to all generations", testament: "OT" },
  { ref: "Psalm 119:103 (LXX 118:103)", text: "How sweet are your words to my throat sweeter than honey to my mouth", testament: "OT" },
  { ref: "Psalm 119:114 (LXX 118:114)", text: "You are my helper and my supporter I have hoped in your words", testament: "OT" },
  { ref: "Psalm 119:130 (LXX 118:130)", text: "The manifestation of your words will give light and will instruct the simple", testament: "OT" },
  { ref: "Psalm 119:165 (LXX 118:165)", text: "Great peace have they that love your law and there is no stumbling block to them", testament: "OT" },
  { ref: "Psalm 121:3-4 (LXX 120:3-4)", text: "May he not suffer your foot to be moved and may your keeper not slumber behold he that keeps Israel shall not slumber nor sleep", testament: "OT" },
  { ref: "Psalm 121:7-8 (LXX 120:7-8)", text: "The Lord shall preserve you from all evil the Lord shall keep your soul the Lord shall keep your coming in and your going out from now and forever", testament: "OT" },
  { ref: "Psalm 122:1 (LXX 121:1)", text: "I was glad when they said to me let us go into the house of the Lord", testament: "OT" },
  { ref: "Psalm 126:5-6 (LXX 125:5-6)", text: "They that sow in tears shall reap in joy they went on and wept as they cast their seeds but they shall surely come with joy bearing their sheaves", testament: "OT" },
  { ref: "Psalm 127:1 (LXX 126:1)", text: "Unless the Lord build the house they labor in vain that build it unless the Lord keep the city the watchman watches in vain", testament: "OT" },
  { ref: "Psalm 130:5-6 (LXX 129:5-6)", text: "I have waited for you O Lord my soul has waited for your word my soul has hoped in the Lord from the morning watch until night", testament: "OT" },
  { ref: "Psalm 133:1 (LXX 132:1)", text: "Behold how good and how pleasant it is for brethren to dwell together in unity", testament: "OT" },
  { ref: "Psalm 138:8 (LXX 137:8)", text: "The Lord will repay on my behalf your mercy O Lord endures forever do not forsake the works of your hands", testament: "OT" },
  { ref: "Psalm 139:1-2 (LXX 138:1-2)", text: "O Lord you have proved me and known me you know my sitting down and my rising up you understand my thoughts long before", testament: "OT" },
  { ref: "Psalm 139:7-8 (LXX 138:7-8)", text: "Where shall I go from your Spirit and where shall I flee from your presence if I should go up to heaven you are there if I should go down to hades you are present", testament: "OT" },
  { ref: "Psalm 139:23-24 (LXX 138:23-24)", text: "Prove me O God and know my heart try me and know my paths and see if there be any way of iniquity in me and lead me in the everlasting way", testament: "OT" },
  { ref: "Psalm 141:3 (LXX 140:3)", text: "Set a watch O Lord before my mouth and a door of safety about my lips", testament: "OT" },
  { ref: "Psalm 143:8 (LXX 142:8)", text: "Cause me to hear your mercy in the morning for I have hoped in you make known to me the way in which I should walk for I have lifted up my soul to you", testament: "OT" },
  { ref: "Psalm 143:10 (LXX 142:10)", text: "Teach me to do your will for you are my God your good Spirit shall guide me in the land of uprightness", testament: "OT" },
  { ref: "Psalm 145:3 (LXX 144:3)", text: "Great is the Lord and greatly to be praised and of his greatness there is no end", testament: "OT" },
  { ref: "Psalm 145:8-9 (LXX 144:8-9)", text: "The Lord is compassionate and merciful longsuffering and abundant in mercy the Lord is good to all and his compassions are over all his works", testament: "OT" },
  { ref: "Psalm 146:5-6 (LXX 145:5-6)", text: "Blessed is he whose helper is the God of Jacob whose hope is in the Lord his God who made the heaven and the earth the sea and all things in them", testament: "OT" },
  { ref: "Psalm 147:3 (LXX 146:3)", text: "He heals the broken in heart and binds up their wounds", testament: "OT" },
  { ref: "Psalm 148:13 (LXX 148:13)", text: "Let them praise the name of the Lord for his name alone is exalted his praise is above the earth and heaven", testament: "OT" },
  { ref: "Psalm 149:1 (LXX 149:1)", text: "Sing to the Lord a new song his praise is in the assembly of the saints", testament: "OT" },
  { ref: "Proverbs 1:7", text: "The fear of the Lord is the beginning of wisdom and there is good understanding to all that practice it", testament: "OT" },
  { ref: "Proverbs 3:5-6", text: "Trust in God with all your heart and do not exalt your own wisdom in all your ways acknowledge her that she may rightly direct your paths", testament: "OT" },
  { ref: "Proverbs 3:9", text: "Honor the Lord with your righteous labors and give him the firstfruits of your fruits of righteousness", testament: "OT" },
  { ref: "Proverbs 4:23", text: "Keep your heart with all diligence for out of these are the issues of life", testament: "OT" },
  { ref: "Proverbs 11:25", text: "A generous soul shall be enriched and a man of wrath shall not be treated well", testament: "OT" },
  { ref: "Proverbs 16:3", text: "Commit your works unto the Lord and your thoughts shall be established", testament: "OT" },
  { ref: "Proverbs 16:9", text: "Let the heart of a man think on just things that his steps may be rightly directed by God", testament: "OT" },
  { ref: "Proverbs 22:6", text: "Train up a child in the way he should go and when he is old he will not depart from it", testament: "OT" },
  { ref: "Proverbs 27:17", text: "Iron sharpens iron so a man sharpens the face of his friend", testament: "OT" },
  { ref: "Ecclesiastes 3:1", text: "To everything there is a season and a time for every matter under heaven", testament: "OT" },
  { ref: "Ecclesiastes 12:13", text: "Hear the end of the whole matter fear God and keep his commandments for this is the whole man", testament: "OT" },
  { ref: "Isaiah 6:3", text: "Holy holy holy is the Lord of hosts the whole earth is full of his glory", testament: "OT" },
  { ref: "Isaiah 7:14", text: "Therefore the Lord himself shall give you a sign behold the virgin shall conceive and bear a son and you shall call his name Emmanuel", testament: "OT" },
  { ref: "Isaiah 9:6", text: "For a child is born to us and a son is given to us whose government is upon his shoulder and his name is called the Angel of Great Counsel", testament: "OT" },
  { ref: "Isaiah 40:8", text: "The grass withers and the flower falls but the word of our God abides forever", testament: "OT" },
  { ref: "Isaiah 40:31", text: "But they that wait on God shall renew their strength they shall put forth feathers like eagles they shall run and not be weary they shall walk and not hunger", testament: "OT" },
  { ref: "Isaiah 41:10", text: "Fear not for I am with you wander not for I am your God who has strengthened you and I have helped you and I have established you with my righteous right hand", testament: "OT" },
  { ref: "Isaiah 43:2", text: "And if you pass through water I am with you and the rivers shall not overflow you and if you go through fire you shall not be burned", testament: "OT" },
  { ref: "Isaiah 43:19", text: "Behold I make new things which shall now spring forth and you shall know them and I will make a way in the wilderness and rivers in the dry land", testament: "OT" },
  { ref: "Isaiah 53:5", text: "But he was wounded on account of our sins and was bruised because of our transgressions the chastisement of our peace was upon him and by his bruise we were healed", testament: "OT" },
  { ref: "Isaiah 55:8-9", text: "For my counsels are not as your counsels nor are my ways as your ways says the Lord but as heaven is distant from earth so is my way distant from your ways", testament: "OT" },
  { ref: "Isaiah 55:11", text: "So shall my word be whatever shall proceed from my mouth it shall not return to me empty until all the things that I willed shall have been accomplished", testament: "OT" },
  { ref: "Isaiah 61:1", text: "The Spirit of the Lord is upon me because he has anointed me to preach good tidings to the poor he has sent me to heal the brokenhearted", testament: "OT" },
  { ref: "Jeremiah 17:7", text: "Blessed is the man who trusts in the Lord and whose hope the Lord shall be", testament: "OT" },
  { ref: "Jeremiah 29:11", text: "For I know the thoughts that I think toward you says the Lord thoughts of peace and not of evil to give you a future and a hope", testament: "OT" },
  { ref: "Jeremiah 33:3", text: "Call upon me and I will hearken to you and I will tell you great and important things which you do not know", testament: "OT" },
  { ref: "Lamentations 3:22-23", text: "The mercies of the Lord are that he has not forsaken me because his compassions have not failed they are new every morning great is your faithfulness", testament: "OT" },
  { ref: "Ezekiel 36:26", text: "And I will give you a new heart and will put a new spirit in you and I will take away the heart of stone out of your flesh and give you a heart of flesh", testament: "OT" },
  { ref: "Daniel 3:17", text: "For there is a God in the heavens whom we serve who is able to deliver us from the burning fiery furnace", testament: "OT" },
  { ref: "Hosea 6:6", text: "For I desire mercy and not sacrifice and the knowledge of God rather than whole burnt offerings", testament: "OT" },
  { ref: "Joel 2:28", text: "And it shall come to pass afterward that I will pour out my Spirit upon all flesh and your sons and your daughters shall prophesy", testament: "OT" },
  { ref: "Micah 6:8", text: "What does the Lord require of you but to do justice and to love mercy and to be ready to walk with the Lord your God", testament: "OT" },
  { ref: "Habakkuk 2:4", text: "But the just shall live by my faith", testament: "OT" },
  { ref: "Zephaniah 3:17", text: "The Lord your God is in you the mighty one shall save you he shall bring joy upon you and shall refresh you with his love", testament: "OT" },
  { ref: "Malachi 3:10", text: "Bring all the tithes into the storehouse and let there be food in my house and prove me now herewith says the Lord Almighty", testament: "OT" },
];

const NT_VERSES = [
  { ref: "Matthew 4:4", text: "Man shall not live by bread alone but by every word that proceeds from the mouth of God", testament: "NT" },
  { ref: "Matthew 5:3", text: "Blessed are the poor in spirit for theirs is the kingdom of heaven", testament: "NT" },
  { ref: "Matthew 5:6", text: "Blessed are those who hunger and thirst for righteousness for they shall be filled", testament: "NT" },
  { ref: "Matthew 5:8", text: "Blessed are the pure in heart for they shall see God", testament: "NT" },
  { ref: "Matthew 5:14", text: "You are the light of the world a city that is set on a hill cannot be hidden", testament: "NT" },
  { ref: "Matthew 5:16", text: "Let your light so shine before men that they may see your good works and glorify your Father in heaven", testament: "NT" },
  { ref: "Matthew 5:44", text: "But I say to you love your enemies bless those who curse you do good to those who hate you and pray for those who spitefully use you and persecute you", testament: "NT" },
  { ref: "Matthew 6:9-10", text: "Our Father in heaven hallowed be Your name Your kingdom come Your will be done on earth as it is in heaven", testament: "NT" },
  { ref: "Matthew 6:33", text: "But seek first the kingdom of God and His righteousness and all these things shall be added to you", testament: "NT" },
  { ref: "Matthew 6:34", text: "Therefore do not worry about tomorrow for tomorrow will worry about its own things sufficient for the day is its own trouble", testament: "NT" },
  { ref: "Matthew 7:7", text: "Ask and it will be given to you seek and you will find knock and it will be opened to you", testament: "NT" },
  { ref: "Matthew 11:28", text: "Come to Me all you who labor and are heavy laden and I will give you rest", testament: "NT" },
  { ref: "Matthew 11:29-30", text: "Take My yoke upon you and learn from Me for I am gentle and lowly in heart and you will find rest for your souls for My yoke is easy and My burden is light", testament: "NT" },
  { ref: "Matthew 16:24", text: "If anyone desires to come after Me let him deny himself and take up his cross and follow Me", testament: "NT" },
  { ref: "Matthew 17:20", text: "If you have faith as a mustard seed you will say to this mountain move from here to there and it will move and nothing will be impossible for you", testament: "NT" },
  { ref: "Matthew 19:26", text: "With men this is impossible but with God all things are possible", testament: "NT" },
  { ref: "Matthew 22:37-38", text: "You shall love the Lord your God with all your heart with all your soul and with all your mind this is the first and great commandment", testament: "NT" },
  { ref: "Matthew 28:19", text: "Go therefore and make disciples of all the nations baptizing them in the name of the Father and of the Son and of the Holy Spirit", testament: "NT" },
  { ref: "Matthew 28:20", text: "Teaching them to observe all things that I have commanded you and lo I am with you always even to the end of the age", testament: "NT" },
  { ref: "Mark 9:23", text: "If you can believe all things are possible to him who believes", testament: "NT" },
  { ref: "Mark 10:27", text: "With men it is impossible but not with God for with God all things are possible", testament: "NT" },
  { ref: "Mark 10:45", text: "For even the Son of Man did not come to be served but to serve and to give His life a ransom for many", testament: "NT" },
  { ref: "Mark 11:24", text: "Therefore I say to you whatever things you ask when you pray believe that you receive them and you will have them", testament: "NT" },
  { ref: "Luke 1:37", text: "For with God nothing will be impossible", testament: "NT" },
  { ref: "Luke 1:46-47", text: "My soul magnifies the Lord and my spirit has rejoiced in God my Savior", testament: "NT" },
  { ref: "Luke 6:31", text: "And just as you want men to do to you you also do to them likewise", testament: "NT" },
  { ref: "Luke 6:37", text: "Judge not and you shall not be judged condemn not and you shall not be condemned forgive and you will be forgiven", testament: "NT" },
  { ref: "Luke 6:38", text: "Give and it will be given to you good measure pressed down shaken together and running over will be put into your bosom", testament: "NT" },
  { ref: "Luke 9:23", text: "If anyone desires to come after Me let him deny himself and take up his cross daily and follow Me", testament: "NT" },
  { ref: "Luke 12:34", text: "For where your treasure is there your heart will be also", testament: "NT" },
  { ref: "John 1:1", text: "In the beginning was the Word and the Word was with God and the Word was God", testament: "NT" },
  { ref: "John 1:14", text: "And the Word became flesh and dwelt among us and we beheld His glory the glory as of the only begotten of the Father full of grace and truth", testament: "NT" },
  { ref: "John 3:16", text: "For God so loved the world that He gave His only begotten Son that whoever believes in Him should not perish but have everlasting life", testament: "NT" },
  { ref: "John 3:17", text: "For God did not send His Son into the world to condemn the world but that the world through Him might be saved", testament: "NT" },
  { ref: "John 8:12", text: "I am the light of the world he who follows Me shall not walk in darkness but have the light of life", testament: "NT" },
  { ref: "John 8:32", text: "And you shall know the truth and the truth shall make you free", testament: "NT" },
  { ref: "John 8:36", text: "Therefore if the Son makes you free you shall be free indeed", testament: "NT" },
  { ref: "John 10:10", text: "I have come that they may have life and that they may have it more abundantly", testament: "NT" },
  { ref: "John 10:27-28", text: "My sheep hear My voice and I know them and they follow Me and I give them eternal life and they shall never perish", testament: "NT" },
  { ref: "John 11:25-26", text: "I am the resurrection and the life he who believes in Me though he may die he shall live and whoever lives and believes in Me shall never die", testament: "NT" },
  { ref: "John 13:34", text: "A new commandment I give to you that you love one another as I have loved you that you also love one another", testament: "NT" },
  { ref: "John 13:35", text: "By this all will know that you are My disciples if you have love for one another", testament: "NT" },
  { ref: "John 14:1", text: "Let not your heart be troubled you believe in God believe also in Me", testament: "NT" },
  { ref: "John 14:6", text: "I am the way the truth and the life no one comes to the Father except through Me", testament: "NT" },
  { ref: "John 14:27", text: "Peace I leave with you My peace I give to you not as the world gives do I give to you let not your heart be troubled neither let it be afraid", testament: "NT" },
  { ref: "John 15:5", text: "I am the vine you are the branches he who abides in Me and I in him bears much fruit for without Me you can do nothing", testament: "NT" },
  { ref: "John 15:12", text: "This is My commandment that you love one another as I have loved you", testament: "NT" },
  { ref: "John 15:13", text: "Greater love has no one than this than to lay down ones life for his friends", testament: "NT" },
  { ref: "John 16:33", text: "These things I have spoken to you that in Me you may have peace in the world you will have tribulation but be of good cheer I have overcome the world", testament: "NT" },
  { ref: "Acts 1:8", text: "But you shall receive power when the Holy Spirit has come upon you and you shall be witnesses to Me in Jerusalem and in all Judea and Samaria and to the end of the earth", testament: "NT" },
  { ref: "Acts 2:38", text: "Repent and let every one of you be baptized in the name of Jesus Christ for the remission of sins and you shall receive the gift of the Holy Spirit", testament: "NT" },
  { ref: "Acts 4:12", text: "Nor is there salvation in any other for there is no other name under heaven given among men by which we must be saved", testament: "NT" },
  { ref: "Acts 17:28", text: "For in Him we live and move and have our being", testament: "NT" },
  { ref: "Romans 1:16", text: "For I am not ashamed of the gospel of Christ for it is the power of God to salvation for everyone who believes", testament: "NT" },
  { ref: "Romans 3:23", text: "For all have sinned and fall short of the glory of God", testament: "NT" },
  { ref: "Romans 5:1", text: "Therefore having been justified by faith we have peace with God through our Lord Jesus Christ", testament: "NT" },
  { ref: "Romans 5:8", text: "But God demonstrates His own love toward us in that while we were still sinners Christ died for us", testament: "NT" },
  { ref: "Romans 6:23", text: "For the wages of sin is death but the gift of God is eternal life in Christ Jesus our Lord", testament: "NT" },
  { ref: "Romans 8:1", text: "There is therefore now no condemnation to those who are in Christ Jesus who do not walk according to the flesh but according to the Spirit", testament: "NT" },
  { ref: "Romans 8:18", text: "For I consider that the sufferings of this present time are not worthy to be compared with the glory which shall be revealed in us", testament: "NT" },
  { ref: "Romans 8:28", text: "And we know that all things work together for good to those who love God to those who are the called according to His purpose", testament: "NT" },
  { ref: "Romans 8:31", text: "What then shall we say to these things if God is for us who can be against us", testament: "NT" },
  { ref: "Romans 8:37", text: "Yet in all these things we are more than conquerors through Him who loved us", testament: "NT" },
  { ref: "Romans 8:38-39", text: "For I am persuaded that neither death nor life nor angels nor principalities nor powers nor things present nor things to come shall be able to separate us from the love of God", testament: "NT" },
  { ref: "Romans 10:9", text: "That if you confess with your mouth the Lord Jesus and believe in your heart that God has raised Him from the dead you will be saved", testament: "NT" },
  { ref: "Romans 10:17", text: "So then faith comes by hearing and hearing by the word of God", testament: "NT" },
  { ref: "Romans 12:1", text: "I beseech you therefore brethren by the mercies of God that you present your bodies a living sacrifice holy acceptable to God which is your reasonable service", testament: "NT" },
  { ref: "Romans 12:2", text: "And do not be conformed to this world but be transformed by the renewing of your mind that you may prove what is that good and acceptable and perfect will of God", testament: "NT" },
  { ref: "Romans 12:12", text: "Rejoicing in hope patient in tribulation continuing steadfastly in prayer", testament: "NT" },
  { ref: "Romans 15:13", text: "Now may the God of hope fill you with all joy and peace in believing that you may abound in hope by the power of the Holy Spirit", testament: "NT" },
  { ref: "1 Corinthians 1:18", text: "For the message of the cross is foolishness to those who are perishing but to us who are being saved it is the power of God", testament: "NT" },
  { ref: "1 Corinthians 2:9", text: "Eye has not seen nor ear heard nor have entered into the heart of man the things which God has prepared for those who love Him", testament: "NT" },
  { ref: "1 Corinthians 6:19", text: "Or do you not know that your body is the temple of the Holy Spirit who is in you whom you have from God and you are not your own", testament: "NT" },
  { ref: "1 Corinthians 10:13", text: "No temptation has overtaken you except such as is common to man but God is faithful who will not allow you to be tempted beyond what you are able", testament: "NT" },
  { ref: "1 Corinthians 13:4-5", text: "Love suffers long and is kind love does not envy love does not parade itself is not puffed up does not behave rudely does not seek its own", testament: "NT" },
  { ref: "1 Corinthians 13:13", text: "And now abide faith hope love these three but the greatest of these is love", testament: "NT" },
  { ref: "1 Corinthians 15:55-57", text: "O Death where is your sting O Hades where is your victory but thanks be to God who gives us the victory through our Lord Jesus Christ", testament: "NT" },
  { ref: "1 Corinthians 16:13", text: "Watch stand fast in the faith be brave be strong", testament: "NT" },
  { ref: "2 Corinthians 4:17", text: "For our light affliction which is but for a moment is working for us a far more exceeding and eternal weight of glory", testament: "NT" },
  { ref: "2 Corinthians 4:18", text: "While we do not look at the things which are seen but at the things which are not seen for the things which are seen are temporary but the things which are not seen are eternal", testament: "NT" },
  { ref: "2 Corinthians 5:7", text: "For we walk by faith not by sight", testament: "NT" },
  { ref: "2 Corinthians 5:17", text: "Therefore if anyone is in Christ he is a new creation old things have passed away behold all things have become new", testament: "NT" },
  { ref: "2 Corinthians 9:7", text: "So let each one give as he purposes in his heart not grudgingly or of necessity for God loves a cheerful giver", testament: "NT" },
  { ref: "2 Corinthians 12:9", text: "My grace is sufficient for you for My strength is made perfect in weakness", testament: "NT" },
  { ref: "Galatians 2:20", text: "I have been crucified with Christ it is no longer I who live but Christ lives in me and the life which I now live in the flesh I live by faith in the Son of God", testament: "NT" },
  { ref: "Galatians 5:22-23", text: "But the fruit of the Spirit is love joy peace longsuffering kindness goodness faithfulness gentleness self-control against such there is no law", testament: "NT" },
  { ref: "Galatians 6:9", text: "And let us not grow weary while doing good for in due season we shall reap if we do not lose heart", testament: "NT" },
  { ref: "Ephesians 2:8-9", text: "For by grace you have been saved through faith and that not of yourselves it is the gift of God not of works lest anyone should boast", testament: "NT" },
  { ref: "Ephesians 2:10", text: "For we are His workmanship created in Christ Jesus for good works which God prepared beforehand that we should walk in them", testament: "NT" },
  { ref: "Ephesians 3:20", text: "Now to Him who is able to do exceedingly abundantly above all that we ask or think according to the power that works in us", testament: "NT" },
  { ref: "Ephesians 4:32", text: "And be kind to one another tenderhearted forgiving one another even as God in Christ forgave you", testament: "NT" },
  { ref: "Ephesians 6:10", text: "Finally my brethren be strong in the Lord and in the power of His might", testament: "NT" },
  { ref: "Ephesians 6:11", text: "Put on the whole armor of God that you may be able to stand against the wiles of the devil", testament: "NT" },
  { ref: "Philippians 1:6", text: "Being confident of this very thing that He who has begun a good work in you will complete it until the day of Jesus Christ", testament: "NT" },
  { ref: "Philippians 1:21", text: "For to me to live is Christ and to die is gain", testament: "NT" },
  { ref: "Philippians 2:3", text: "Let nothing be done through selfish ambition or conceit but in lowliness of mind let each esteem others better than himself", testament: "NT" },
  { ref: "Philippians 3:14", text: "I press toward the goal for the prize of the upward call of God in Christ Jesus", testament: "NT" },
  { ref: "Philippians 4:4", text: "Rejoice in the Lord always again I will say rejoice", testament: "NT" },
  { ref: "Philippians 4:6-7", text: "Be anxious for nothing but in everything by prayer and supplication with thanksgiving let your requests be made known to God and the peace of God which surpasses all understanding will guard your hearts and minds through Christ Jesus", testament: "NT" },
  { ref: "Philippians 4:8", text: "Finally brethren whatever things are true whatever things are noble whatever things are just whatever things are pure whatever things are lovely whatever things are of good report meditate on these things", testament: "NT" },
  { ref: "Philippians 4:13", text: "I can do all things through Christ who strengthens me", testament: "NT" },
  { ref: "Philippians 4:19", text: "And my God shall supply all your need according to His riches in glory by Christ Jesus", testament: "NT" },
  { ref: "Colossians 3:2", text: "Set your mind on things above not on things on the earth", testament: "NT" },
  { ref: "Colossians 3:12", text: "Therefore as the elect of God holy and beloved put on tender mercies kindness humility meekness longsuffering", testament: "NT" },
  { ref: "Colossians 3:23", text: "And whatever you do do it heartily as to the Lord and not to men", testament: "NT" },
  { ref: "1 Thessalonians 5:16-18", text: "Rejoice always pray without ceasing in everything give thanks for this is the will of God in Christ Jesus for you", testament: "NT" },
  { ref: "2 Thessalonians 3:3", text: "But the Lord is faithful who will establish you and guard you from the evil one", testament: "NT" },
  { ref: "1 Timothy 4:12", text: "Let no one despise your youth but be an example to the believers in word in conduct in love in spirit in faith in purity", testament: "NT" },
  { ref: "1 Timothy 6:12", text: "Fight the good fight of faith lay hold on eternal life to which you were also called", testament: "NT" },
  { ref: "2 Timothy 1:7", text: "For God has not given us a spirit of fear but of power and of love and of a sound mind", testament: "NT" },
  { ref: "2 Timothy 2:15", text: "Be diligent to present yourself approved to God a worker who does not need to be ashamed rightly dividing the word of truth", testament: "NT" },
  { ref: "2 Timothy 3:16", text: "All Scripture is given by inspiration of God and is profitable for doctrine for reproof for correction for instruction in righteousness", testament: "NT" },
  { ref: "2 Timothy 4:7", text: "I have fought the good fight I have finished the race I have kept the faith", testament: "NT" },
  { ref: "Hebrews 4:12", text: "For the word of God is living and powerful and sharper than any two-edged sword piercing even to the division of soul and spirit", testament: "NT" },
  { ref: "Hebrews 4:16", text: "Let us therefore come boldly to the throne of grace that we may obtain mercy and find grace to help in time of need", testament: "NT" },
  { ref: "Hebrews 11:1", text: "Now faith is the substance of things hoped for the evidence of things not seen", testament: "NT" },
  { ref: "Hebrews 11:6", text: "But without faith it is impossible to please Him for he who comes to God must believe that He is and that He is a rewarder of those who diligently seek Him", testament: "NT" },
  { ref: "Hebrews 12:1", text: "Let us lay aside every weight and the sin which so easily ensnares us and let us run with endurance the race that is set before us", testament: "NT" },
  { ref: "Hebrews 12:2", text: "Looking unto Jesus the author and finisher of our faith who for the joy that was set before Him endured the cross despising the shame", testament: "NT" },
  { ref: "Hebrews 13:5", text: "For He Himself has said I will never leave you nor forsake you", testament: "NT" },
  { ref: "Hebrews 13:8", text: "Jesus Christ is the same yesterday today and forever", testament: "NT" },
  { ref: "James 1:2-3", text: "My brethren count it all joy when you fall into various trials knowing that the testing of your faith produces patience", testament: "NT" },
  { ref: "James 1:5", text: "If any of you lacks wisdom let him ask of God who gives to all liberally and without reproach and it will be given to him", testament: "NT" },
  { ref: "James 1:17", text: "Every good gift and every perfect gift is from above and comes down from the Father of lights with whom there is no variation or shadow of turning", testament: "NT" },
  { ref: "James 1:22", text: "But be doers of the word and not hearers only deceiving yourselves", testament: "NT" },
  { ref: "James 4:7", text: "Therefore submit to God resist the devil and he will flee from you", testament: "NT" },
  { ref: "James 4:8", text: "Draw near to God and He will draw near to you", testament: "NT" },
  { ref: "1 Peter 2:9", text: "But you are a chosen generation a royal priesthood a holy nation His own special people that you may proclaim the praises of Him who called you out of darkness into His marvelous light", testament: "NT" },
  { ref: "1 Peter 3:15", text: "But sanctify the Lord God in your hearts and always be ready to give a defense to everyone who asks you a reason for the hope that is in you", testament: "NT" },
  { ref: "1 Peter 5:7", text: "Casting all your care upon Him for He cares for you", testament: "NT" },
  { ref: "1 Peter 5:8", text: "Be sober be vigilant because your adversary the devil walks about like a roaring lion seeking whom he may devour", testament: "NT" },
  { ref: "2 Peter 3:9", text: "The Lord is not slack concerning His promise but is longsuffering toward us not willing that any should perish but that all should come to repentance", testament: "NT" },
  { ref: "1 John 1:9", text: "If we confess our sins He is faithful and just to forgive us our sins and to cleanse us from all unrighteousness", testament: "NT" },
  { ref: "1 John 3:1", text: "Behold what manner of love the Father has bestowed on us that we should be called children of God", testament: "NT" },
  { ref: "1 John 4:4", text: "You are of God little children and have overcome them because He who is in you is greater than he who is in the world", testament: "NT" },
  { ref: "1 John 4:7", text: "Beloved let us love one another for love is of God and everyone who loves is born of God and knows God", testament: "NT" },
  { ref: "1 John 4:8", text: "He who does not love does not know God for God is love", testament: "NT" },
  { ref: "1 John 4:19", text: "We love Him because He first loved us", testament: "NT" },
  { ref: "1 John 5:4", text: "For whatever is born of God overcomes the world and this is the victory that has overcome the world our faith", testament: "NT" },
  { ref: "Revelation 1:8", text: "I am the Alpha and the Omega the Beginning and the End says the Lord who is and who was and who is to come the Almighty", testament: "NT" },
  { ref: "Revelation 3:20", text: "Behold I stand at the door and knock if anyone hears My voice and opens the door I will come in to him and dine with him and he with Me", testament: "NT" },
  { ref: "Revelation 21:4", text: "And God will wipe away every tear from their eyes there shall be no more death nor sorrow nor crying there shall be no more pain for the former things have passed away", testament: "NT" },
  { ref: "Revelation 22:13", text: "I am the Alpha and the Omega the Beginning and the End the First and the Last", testament: "NT" },
];

const ALL_VERSES = [...OT_VERSES, ...NT_VERSES];

/* ============================================================
   WHO SAID IT - DATA
   ============================================================ */

/* ============================================================
   WHO SAID IT - DATA (no references, includes Church Fathers)
   ============================================================ */
const WHO_SAID_IT_DATA = [
  // CHRIST
  { quote: "Before Abraham was, I AM", speaker: "Christ" },
  { quote: "I am the way, the truth, and the life. No one comes to the Father except through Me", speaker: "Christ" },
  { quote: "I am the resurrection and the life", speaker: "Christ" },
  { quote: "Come to Me, all you who labor and are heavy laden, and I will give you rest", speaker: "Christ" },
  { quote: "I am the light of the world", speaker: "Christ" },
  { quote: "It is finished", speaker: "Christ" },
  { quote: "I am the vine, you are the branches", speaker: "Christ" },
  { quote: "Love your enemies, bless those who curse you", speaker: "Christ" },
  { quote: "For where two or three are gathered together in My name, I am there in the midst of them", speaker: "Christ" },
  { quote: "I am the bread of life", speaker: "Christ" },
  { quote: "Father, forgive them, for they do not know what they do", speaker: "Christ" },
  { quote: "You must be born again", speaker: "Christ" },
  { quote: "Render to Caesar the things that are Caesar's, and to God the things that are God's", speaker: "Christ" },
  { quote: "I am the Good Shepherd. The Good Shepherd gives His life for the sheep", speaker: "Christ" },
  { quote: "Let the little children come to Me, and do not forbid them", speaker: "Christ" },
  { quote: "Go and sin no more", speaker: "Christ" },
  { quote: "Peace I leave with you, My peace I give to you", speaker: "Christ" },
  { quote: "I am the door. If anyone enters by Me, he will be saved", speaker: "Christ" },
  { quote: "Take, eat; this is My body", speaker: "Christ" },
  { quote: "The Son of Man did not come to be served, but to serve", speaker: "Christ" },
  { quote: "He who is without sin among you, let him throw a stone at her first", speaker: "Christ" },
  { quote: "My kingdom is not of this world", speaker: "Christ" },
  { quote: "I am the Alpha and the Omega, the Beginning and the End", speaker: "Christ" },
  { quote: "Blessed are the pure in heart, for they shall see God", speaker: "Christ" },
  // MOSES
  { quote: "Who am I that I should go to Pharaoh?", speaker: "Moses" },
  { quote: "Let my people go, that they may hold a feast to Me in the wilderness", speaker: "Moses" },
  { quote: "Stand still, and see the salvation of the Lord", speaker: "Moses" },
  { quote: "What shall I do with this people? They are almost ready to stone me", speaker: "Moses" },
  { quote: "Oh, these people have committed a great sin, and have made for themselves a god of gold", speaker: "Moses" },
  { quote: "Please, show me Your glory", speaker: "Moses" },
  { quote: "Hear, O Israel: The Lord our God, the Lord is one", speaker: "Moses" },
  { quote: "Choose life, that both you and your descendants may live", speaker: "Moses" },
  // DAVID
  { quote: "The Lord is my shepherd; I shall not want", speaker: "David" },
  { quote: "Create in me a clean heart, O God", speaker: "David" },
  { quote: "The Lord is my light and my salvation; whom shall I fear?", speaker: "David" },
  { quote: "You come to me with a sword, a spear, and a javelin. But I come to you in the name of the Lord of hosts", speaker: "David" },
  { quote: "How long, O Lord? Will You forget me forever?", speaker: "David" },
  { quote: "I have sinned against the Lord", speaker: "David" },
  { quote: "Bless the Lord, O my soul; and all that is within me, bless His holy name", speaker: "David" },
  { quote: "As the deer pants for the water brooks, so pants my soul for You, O God", speaker: "David" },
  { quote: "The earth is the Lord's, and all its fullness, the world and those who dwell therein", speaker: "David" },
  // SOLOMON
  { quote: "Vanity of vanities, all is vanity", speaker: "Solomon" },
  { quote: "Trust in the Lord with all your heart, and lean not on your own understanding", speaker: "Solomon" },
  { quote: "The fear of the Lord is the beginning of wisdom", speaker: "Solomon" },
  { quote: "To everything there is a season, a time for every purpose under heaven", speaker: "Solomon" },
  { quote: "A friend loves at all times, and a brother is born for adversity", speaker: "Solomon" },
  { quote: "Train up a child in the way he should go, and when he is old he will not depart from it", speaker: "Solomon" },
  { quote: "Iron sharpens iron, so a man sharpens the countenance of his friend", speaker: "Solomon" },
  { quote: "Give me now wisdom and knowledge", speaker: "Solomon" },
  { quote: "Guard your heart with all diligence, for out of it spring the issues of life", speaker: "Solomon" },
  // PAUL
  { quote: "For to me, to live is Christ, and to die is gain", speaker: "Paul" },
  { quote: "I can do all things through Christ who strengthens me", speaker: "Paul" },
  { quote: "For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord", speaker: "Paul" },
  { quote: "I have fought the good fight, I have finished the race, I have kept the faith", speaker: "Paul" },
  { quote: "If God is for us, who can be against us?", speaker: "Paul" },
  { quote: "And now abide faith, hope, love, these three; but the greatest of these is love", speaker: "Paul" },
  { quote: "For by grace you have been saved through faith, and that not of yourselves; it is the gift of God", speaker: "Paul" },
  { quote: "I have been crucified with Christ; it is no longer I who live, but Christ lives in me", speaker: "Paul" },
  { quote: "Be anxious for nothing, but in everything by prayer and supplication, with thanksgiving, let your requests be made known to God", speaker: "Paul" },
  { quote: "For all have sinned and fall short of the glory of God", speaker: "Paul" },
  { quote: "We are more than conquerors through Him who loved us", speaker: "Paul" },
  { quote: "God has not given us a spirit of fear, but of power and of love and of a sound mind", speaker: "Paul" },
  { quote: "Do not be conformed to this world, but be transformed by the renewing of your mind", speaker: "Paul" },
  { quote: "For me to live is Christ, and to die is gain", speaker: "Paul" },
  // PETER
  { quote: "You are the Christ, the Son of the living God", speaker: "Peter" },
  { quote: "Lord, to whom shall we go? You have the words of eternal life", speaker: "Peter" },
  { quote: "Silver and gold I do not have, but what I do have I give you: In the name of Jesus Christ of Nazareth, rise up and walk", speaker: "Peter" },
  { quote: "Casting all your care upon Him, for He cares for you", speaker: "Peter" },
  { quote: "Lord, if it is You, command me to come to You on the water", speaker: "Peter" },
  { quote: "Nor is there salvation in any other, for there is no other name under heaven given among men by which we must be saved", speaker: "Peter" },
  // JAMES
  { quote: "Faith without works is dead", speaker: "James" },
  { quote: "If any of you lacks wisdom, let him ask of God, who gives to all liberally", speaker: "James" },
  { quote: "Submit to God. Resist the devil and he will flee from you", speaker: "James" },
  { quote: "Draw near to God and He will draw near to you", speaker: "James" },
  { quote: "Count it all joy when you fall into various trials", speaker: "James" },
  { quote: "Every good gift and every perfect gift is from above", speaker: "James" },
  { quote: "Be doers of the word, and not hearers only", speaker: "James" },
  // ISAIAH
  { quote: "Here am I! Send me", speaker: "Isaiah" },
  { quote: "For unto us a Child is born, unto us a Son is given", speaker: "Isaiah" },
  { quote: "But those who wait on the Lord shall renew their strength; they shall mount up with wings like eagles", speaker: "Isaiah" },
  { quote: "Behold, the virgin shall conceive and bear a Son, and shall call His name Immanuel", speaker: "Isaiah" },
  { quote: "He was wounded for our transgressions, He was bruised for our iniquities", speaker: "Isaiah" },
  // GOD THE FATHER
  { quote: "Let there be light", speaker: "God" },
  { quote: "It is not good that man should be alone", speaker: "God" },
  { quote: "I AM WHO I AM", speaker: "God" },
  { quote: "Be still, and know that I am God", speaker: "God" },
  { quote: "For I know the plans I have for you, plans of peace and not of evil, to give you a future and a hope", speaker: "God" },
  { quote: "This is My beloved Son, in whom I am well pleased", speaker: "God" },
  { quote: "Fear not, for I am with you; be not dismayed, for I am your God", speaker: "God" },
  // JOHN
  { quote: "In the beginning was the Word, and the Word was with God, and the Word was God", speaker: "John" },
  { quote: "Beloved, let us love one another, for love is of God", speaker: "John" },
  { quote: "God is love", speaker: "John" },
  // JOHN THE BAPTIST
  { quote: "Behold! The Lamb of God who takes away the sin of the world!", speaker: "John the Baptist" },
  { quote: "He must increase, but I must decrease", speaker: "John the Baptist" },
  // CHURCH FATHERS
  { quote: "The Son of God became man so that we might become God", speaker: "St. Athanasius" },
  { quote: "The unexamined life is the unspiritual life, and such a life is not worth living", speaker: "St. Athanasius" },
  { quote: "You cannot put straight in others what is warped in yourself", speaker: "St. Athanasius" },
  { quote: "The Word was not degraded by receiving a body, rather He deified what He put on", speaker: "St. Athanasius" },
  { quote: "He became what we are that He might make us what He is", speaker: "St. Athanasius" },
  { quote: "For the Son of God became man so that the sons of men might become sons of God", speaker: "St. Cyril of Alexandria" },
  { quote: "We do not worship a creature, but rather the Lord of creation, the incarnate Word of God", speaker: "St. Cyril of Alexandria" },
  { quote: "The mystery of the Incarnation of the Word contains in itself the whole meaning of all the symbols and all the enigmas of Scripture", speaker: "St. Cyril of Alexandria" },
  { quote: "Let us not be ashamed to confess the Crucified. Let the cross be our seal", speaker: "St. Cyril of Jerusalem" },
  { quote: "No one heals himself by wounding another", speaker: "St. Ambrose" },
  { quote: "The bee is more honored than other animals, not because she labors, but because she labors for others", speaker: "St. John Chrysostom" },
  { quote: "Prayer is the place of refuge for every worry, a foundation for cheerfulness, a source of constant happiness, a protection against sadness", speaker: "St. John Chrysostom" },
  { quote: "If you cannot find Christ in the beggar at the church door, you will not find Him in the chalice", speaker: "St. John Chrysostom" },
  { quote: "A comprehended God is no God", speaker: "St. John Chrysostom" },
  { quote: "Not to share our own wealth with the poor is theft from the poor and deprivation of their means of life", speaker: "St. John Chrysostom" },
  { quote: "Strive to enter through the narrow gate of fasting, for through the wide gate of pleasure comes every sin", speaker: "St. Basil the Great" },
  { quote: "A dog is better than I am, for he has love and does not judge", speaker: "St. Basil the Great" },
  { quote: "The bread which you do not use is the bread of the hungry", speaker: "St. Basil the Great" },
  { quote: "Troubles are usually the brooms and shovels that smooth the road to a good man's fortune", speaker: "St. Basil the Great" },
  { quote: "Who weeps for the serpent of worldly pleasure, having learned that it leads to destruction?", speaker: "St. Gregory the Theologian" },
  { quote: "Recognize what great worth has been conferred on you. Consider your calling", speaker: "St. Gregory the Theologian" },
  { quote: "I withdrew from the world before I learned to be among people, and I know not how to teach others before I have been taught myself", speaker: "St. Gregory the Theologian" },
  { quote: "Sit in your cell, and your cell will teach you everything", speaker: "St. Anthony the Great" },
  { quote: "I no longer fear God, but I love Him", speaker: "St. Anthony the Great" },
  { quote: "I saw the snares that the enemy spreads out over the world, and I said groaning: What can get through such snares? Then I heard a voice saying to me: Humility", speaker: "St. Anthony the Great" },
  { quote: "If a man treats a matter with humility, God will not stop revealing things to him until the end", speaker: "St. Moses the Black" },
  { quote: "Go, sit in your cell, and your cell will teach you everything", speaker: "Abba Moses" },
  { quote: "A brother in Scetis committed a fault. A council was called to which Abba Moses was invited, but he refused to go", speaker: "Abba Moses" },
  { quote: "If you are silent, you will have peace wherever you live", speaker: "Abba Poemen" },
  { quote: "Teach your mouth to say what is in your heart", speaker: "Abba Poemen" },
  { quote: "The nature of water is soft, that of stone is hard; but if a bottle is hung above the stone, the water will wear away the stone. So it is with the word of God", speaker: "Abba Poemen" },
  { quote: "Do not give your heart to that which does not satisfy your heart", speaker: "Abba Poemen" },
  { quote: "Possess nothing that you would not freely and gladly give to anyone who needed it more than you", speaker: "St. Macarius the Great" },
  { quote: "If you find that there is no struggle in prayer, you should be concerned, for you may have already walked through the wrong door", speaker: "St. Macarius the Great" },
  { quote: "Our hearts are restless until they rest in You", speaker: "St. Augustine" },
  { quote: "You have made us for Yourself, O Lord, and our hearts are restless until they rest in You", speaker: "St. Augustine" },
  { quote: "The world is a book, and those who do not travel read only one page", speaker: "St. Augustine" },
  { quote: "Pray as though everything depended on God. Work as though everything depended on you", speaker: "St. Augustine" },
  { quote: "Late have I loved You, Beauty so ancient and so new, late have I loved You", speaker: "St. Augustine" },
  { quote: "Since you cannot do good to all, you are to pay special attention to those who are closest to you", speaker: "St. Augustine" },
  { quote: "God provides the wind, but man must raise the sails", speaker: "St. Augustine" },
  { quote: "He who made you without your consent does not justify you without your consent", speaker: "St. Augustine" },
  { quote: "The glory of God is the living man; and the life of man consists in beholding God", speaker: "St. Irenaeus" },
  { quote: "Be concerned about one thing: your salvation. This is all that matters in life", speaker: "Pope Shenouda III" },
  { quote: "Repentance is not just remorse; it is a commitment to change", speaker: "Pope Shenouda III" },
  { quote: "If you want to be free, learn to live simply", speaker: "Pope Shenouda III" },
  { quote: "The person who talks too much usually says little that is meaningful", speaker: "Pope Shenouda III" },
  { quote: "Do not be disturbed by the thoughts that come to you during prayer. Simply turn your attention back to God", speaker: "Pope Shenouda III" },
  { quote: "The Church is not a museum for saints but a hospital for sinners", speaker: "Pope Shenouda III" },
  { quote: "We learn more from our mistakes than from our successes", speaker: "Pope Shenouda III" },
  { quote: "The first drink from the cup of natural sciences will make you an atheist, but at the bottom of the cup, God is waiting", speaker: "St. Clement of Alexandria" },
  { quote: "It is far better to be happy than to have a demon dwelling in you", speaker: "Abba Pambo" },
  { quote: "As long as a person is running, he should have no confidence in himself. Even though he is near the finish, he should still be cautious", speaker: "St. Severus of Antioch" },
  { quote: "Prayer without ceasing is not a ritual of words but the constant awareness of God's presence", speaker: "Origen" },
  // ADDITIONAL DESERT FATHERS & CHURCH FATHERS
  { quote: "I saw the snares that the enemy spreads out over the world and I said groaning What can get through such snares? Then I heard a voice saying Humility", speaker: "St. Anthony the Great" },
  { quote: "He who sits in solitude and is quiet has escaped from three wars: hearing, speaking, and seeing", speaker: "St. Anthony the Great" },
  { quote: "Whoever has not experienced temptation cannot enter into the Kingdom of Heaven", speaker: "St. Anthony the Great" },
  { quote: "I no longer fear God, I love Him", speaker: "St. Anthony the Great" },
  { quote: "Silence is the great revelation", speaker: "St. Arsenius" },
  { quote: "I have often been sorry for having spoken, but never for having held my tongue", speaker: "St. Arsenius" },
  { quote: "A dog is better than I am, for a dog has love and does not judge", speaker: "Abba Moses" },
  { quote: "Go and sit in your cell, and your cell will teach you everything", speaker: "Abba Moses" },
  { quote: "The nature of water is soft, the nature of stone is hard. But if a bottle is hung above the stone letting the water drip on it, it wears away the stone", speaker: "Abba Poemen" },
  { quote: "Teach your mouth to say that which is in your heart", speaker: "Abba Poemen" },
  { quote: "If a man settles in a certain place and does not bring forth the fruit of that place, the place itself casts him out", speaker: "Abba Poemen" },
  { quote: "If you have a heart, you can be saved", speaker: "Abba Pambo" },
  { quote: "God became man so that man might become god", speaker: "St. Athanasius" },
  { quote: "He was not first a common man and then became God. He was God and then became man so that He might make us gods", speaker: "St. Athanasius" },
  { quote: "We do not worship a creature. Far be the thought. We worship the Lord of creation incarnate the Word of God", speaker: "St. Athanasius" },
  { quote: "Not by the nails was He held to the cross, but by love", speaker: "St. Augustine" },
  { quote: "Late have I loved You, Beauty so old and so new", speaker: "St. Augustine" },
  { quote: "If you believe what you like in the Gospel and reject what you do not like, it is not the Gospel you believe but yourself", speaker: "St. Augustine" },
  { quote: "The glory of God is man fully alive", speaker: "St. Irenaeus" },
  { quote: "The blood of the martyrs is the seed of the Church", speaker: "Tertullian" },
  { quote: "The principal purpose of fasting is not the body's affliction but the soul's benefit", speaker: "St. Basil the Great" },
  { quote: "A tree is known by its fruit; a man by his deeds. A good deed is never lost", speaker: "St. Basil the Great" },
  { quote: "The one who sows courtesy reaps friendship, and the one who plants kindness gathers love", speaker: "St. Basil the Great" },
  { quote: "Faithfulness in small things is a big thing", speaker: "St. John Chrysostom" },
  { quote: "The bee is more honored than other animals, not because she labors, but because she labors for others", speaker: "St. John Chrysostom" },
  { quote: "God accepts our desires as though they were of great value. He longs ardently for us to desire and love Him", speaker: "St. John Chrysostom" },
  { quote: "No one heals himself by wounding another", speaker: "St. Ambrose" },
  { quote: "Christ turns all our sunsets into dawns", speaker: "St. Clement of Alexandria" },
  { quote: "A meek person is one who finds excuses for those who annoy him", speaker: "Pope Shenouda III" },
  { quote: "Love that is not tested is not real love", speaker: "Pope Shenouda III" },
  { quote: "Humility is not thinking less of yourself; it is thinking of yourself less", speaker: "Pope Shenouda III" },
  { quote: "Do not argue with thoughts; rather direct your mind to something spiritual", speaker: "Pope Shenouda III" },
  { quote: "The Word of God became man that you also may learn from a man how a man becomes god", speaker: "St. Clement of Alexandria" },
  { quote: "What you are is God's gift to you. What you become is your gift to God", speaker: "St. Shenouda the Archimandrite" },
  { quote: "Fasting is the soul of prayer; mercy is the lifeblood of fasting", speaker: "St. Peter Chrysologus" },
  { quote: "He who loves God will love prayer also. He who loves prayer will guard silence", speaker: "St. Nilus of Sinai" },
  { quote: "The ladder of divine ascent has thirty steps but the first step is renunciation", speaker: "St. John Climacus" },
];

const SPEAKERS = ["Christ", "Moses", "David", "Solomon", "Paul", "Peter", "James", "Isaiah", "God", "John", "John the Baptist", "St. Athanasius", "St. Cyril of Alexandria", "St. Cyril of Jerusalem", "St. John Chrysostom", "St. Basil the Great", "St. Gregory the Theologian", "St. Anthony the Great", "Abba Moses", "Abba Poemen", "St. Macarius the Great", "St. Augustine", "St. Irenaeus", "Pope Shenouda III", "St. Clement of Alexandria", "St. Ambrose", "Abba Pambo", "St. Severus of Antioch", "Origen", "St. Arsenius", "Tertullian", "St. Peter Chrysologus", "St. Nilus of Sinai", "St. John Climacus", "St. Shenouda the Archimandrite"];


/* ============================================================
   GUESS THE SAINT - DATA (from the Synaxarium, with blurbs)
   ============================================================ */
const SAINTS_DATA = [
  // === APOSTLES & EVANGELISTS ===
  { name: "St. Mark the Apostle", clues: ["I wrote one of the four Gospels", "I traveled with St. Paul and St. Barnabas on missionary journeys", "My Gospel is considered the shortest of the four", "I founded the Church of Alexandria in Egypt", "A lion is my symbol"] },
  { name: "St. Peter the Apostle", clues: ["I was a fisherman before following Christ", "I walked on water but began to sink when I doubted", "I denied Christ three times before the rooster crowed", "Christ said upon me He would build His Church", "I was crucified upside down in Rome"] },
  { name: "St. Paul the Apostle", clues: ["Before my conversion I persecuted Christians", "I was blinded by a light on a road", "I wrote more epistles than any other apostle", "I was shipwrecked multiple times during my missionary journeys", "My name was Saul before my encounter with Christ on the road to Damascus"] },
  { name: "St. Thomas the Apostle", clues: ["I said I would not believe unless I saw the nail marks", "Christ appeared to me and told me to stop doubting", "I traveled the farthest east of all the apostles", "I preached the Gospel in India", "I am often called Didymus, meaning the Twin"] },
  { name: "St. Andrew the Apostle", clues: ["I was the first disciple called by Christ", "I was the brother of another prominent apostle", "I brought a boy with five loaves and two fish to Jesus", "I preached in Greece and around the Black Sea", "I was crucified on an X-shaped cross"] },
  { name: "St. Matthew the Apostle", clues: ["I had a profession despised by my people before following Christ", "I wrote the first Gospel in the New Testament", "Jesus saw me sitting at my workplace and said Follow Me", "My Gospel emphasizes Jesus as the fulfillment of prophecy", "I was a tax collector in Capernaum"] },
  { name: "St. Luke the Evangelist", clues: ["I was not one of the twelve apostles", "I was a physician by profession", "I wrote two books of the New Testament", "I was a companion of St. Paul on his journeys", "I wrote the longest Gospel and the Acts of the Apostles"] },
  { name: "St. Bartholomew the Apostle", clues: ["I am also known by another name in the Gospel of John", "I was skeptical when first told about Jesus of Nazareth", "Philip brought me to meet Jesus", "Jesus said of me that I was an Israelite in whom there is no deceit", "I am also called Nathanael"] },
  { name: "St. James the Great", clues: ["I was one of the inner circle of three disciples closest to Christ", "I was the brother of the beloved disciple John", "I witnessed the Transfiguration on Mount Tabor", "I was the first apostle to be martyred", "King Herod Agrippa had me killed by the sword"] },
  { name: "St. Philip the Apostle", clues: ["I was from Bethsaida, the same city as Peter and Andrew", "I brought Nathanael to meet Jesus", "I asked Jesus to show us the Father", "I was involved in the feeding of the five thousand", "Jesus tested me by asking where to buy bread for the crowd"] },
  // === POPES OF ALEXANDRIA ===
  { name: "St. Athanasius the Apostolic", clues: ["I served as Pope of Alexandria for 45 years", "I was exiled five times for defending the faith", "I wrote a famous biography of a desert monk", "I stood against an entire empire defending one theological word", "I am called the Defender of the Faith for fighting Arianism at the Council of Nicaea"] },
  { name: "St. Cyril the Great", clues: ["I was the nephew of Pope Theophilus of Alexandria", "I was known as a brilliant theologian and prolific writer", "I fought against a heresy that divided Christ into two persons", "I presided over a major ecumenical council in 431 AD", "I am called the Pillar of Faith and defender of the title Theotokos at the Council of Ephesus"] },
  { name: "Pope Kyrillos VI", clues: ["I was known for my deep prayer life sometimes praying all night", "I lived in a windmill in Old Cairo before becoming Pope", "I built the great Cathedral of St. Mark in Cairo", "Many miracles have been attributed to my intercession", "I was the 116th Pope of Alexandria"] },
  { name: "Pope Shenouda III", clues: ["Before becoming Pope I was a monk named Father Antonios El-Syriani", "I was a Sunday School teacher and poet before monasticism", "I was exiled by President Sadat to a monastery", "I led the Coptic Church for over 40 years expanding its presence worldwide", "I was the 117th Pope of Alexandria called the Teacher of Generations"] },
  { name: "St. Dioscorus of Alexandria", clues: ["I was the successor of St. Cyril as Pope of Alexandria", "I defended the Orthodox faith at a council in 449 AD", "I was deposed and exiled at a later council I did not accept", "I suffered greatly for refusing to accept a controversial definition of faith", "I am revered as a confessor who upheld Miaphysite Christology at Chalcedon"] },
  { name: "St. Timothy of Alexandria", clues: ["I was a disciple of a famous apostle who wrote letters to me", "Two epistles in the New Testament bear my name", "I was instructed to guard the faith and be an example to believers", "I was made bishop of Ephesus at a young age", "St. Paul called me his true son in the faith"] },
  { name: "St. Peter the Seal of Martyrs", clues: ["I was the 17th Pope of Alexandria", "I established canons for those who lapsed during persecution", "An angel told me someone would try to take my position", "I was the last martyr of the great persecution in Alexandria", "I am called the Seal of Martyrs because the persecution ended after my death"] },
  { name: "Pope Theophilus of Alexandria", clues: ["I was the uncle of a famous Alexandrian Pope", "I destroyed the Serapeum temple in Alexandria", "I was involved in controversies with the monks of the desert", "I presided over the condemnation of Origenism", "My nephew St. Cyril succeeded me as Pope of Alexandria"] },
  // === DESERT FATHERS & MONKS ===
  { name: "St. Anthony the Great", clues: ["I was born in Upper Egypt to wealthy Christian parents", "I gave away all my possessions after hearing a Gospel reading", "I lived alone in the desert for many years battling demons", "Many came to me for guidance and I organized them into communities", "I am called the Father of All Monks"] },
  { name: "St. Paul the First Hermit", clues: ["I fled to the desert during a time of persecution", "A raven brought me bread every day", "I lived in a cave near a palm tree and a spring for decades", "Another famous monk visited me near the end of my life", "I am considered the first Christian hermit and St. Anthony found me at age 113"] },
  { name: "St. Macarius the Great", clues: ["I was originally a camel trader from Upper Egypt", "I lived in the desert of Scetis for over 60 years", "I was known for extraordinary humility and gentleness", "I raised a dead man to prove the truth to a heretic", "A famous monastery in Wadi El Natrun bears my name"] },
  { name: "St. Moses the Black", clues: ["Before my conversion I was a gang leader and thief", "I fled to a monastery in Scetis to hide from authorities", "The monks way of life transformed me completely", "I was ordained as a priest known for great humility", "I was originally from Ethiopia and was martyred by Berbers"] },
  { name: "St. Bishoy", clues: ["An angel appeared to my mother and told her I was chosen", "I lived in the desert of Scetis with the other monks", "I was known for extreme asceticism tying my hair to the ceiling to stay awake in prayer", "Christ appeared to me and I washed His feet", "My body remains incorrupt at my monastery in Wadi El Natrun"] },
  { name: "St. Shenouda the Archimandrite", clues: ["I became a monk at a very young age under my uncle Pgol", "I led the White Monastery in Upper Egypt with thousands of monks and nuns", "I was known for strict discipline and fiery defense of the faith", "I attended the Council of Ephesus with St. Cyril", "I lived to be over 100 years old and am called the Archimandrite"] },
  { name: "St. Pachomius", clues: ["I was a pagan soldier before converting to Christianity", "The kindness of Christians I met while in the army inspired my conversion", "I established a rule of communal monastic life", "I organized monks into communities with shared meals and work", "I am called the Father of Cenobitic Monasticism"] },
  { name: "St. Pishoy (Paisius) the Great", clues: ["I was one of the earliest monks of the desert", "I lived in extreme asceticism in the wilderness of Scetis", "I was known for long periods of fasting and prayer", "I was a contemporary of St. Macarius the Great", "Angels ministered to me in the deep desert"] },
  { name: "St. John the Short (Colobos)", clues: ["I was given my name because of my small stature", "My spiritual father told me to water a dry stick daily and I obeyed", "After years of obedience the dry stick miraculously bore fruit", "I was one of the most famous Desert Fathers of Scetis", "My story of the obedience tree is one of the most beloved of the Desert Fathers"] },
  { name: "St. Arsenius the Great", clues: ["I was a tutor to the sons of the Roman Emperor", "I left the imperial palace to become a monk in Egypt", "I was famous for saying I have often repented of speaking but never of silence", "I wept constantly for his sins despite his holy life", "I went from being teacher of emperors to a humble desert monk in Scetis"] },
  { name: "St. Maximus and St. Domadius", clues: ["We were brothers and sons of a Roman emperor", "We left our royal life to become monks in the Egyptian desert", "We lived together in extreme asceticism in Scetis", "St. Macarius the Great was our spiritual father", "We are known as the two sons of the emperor who chose the desert over the throne"] },
  { name: "St. Samuel the Confessor", clues: ["I was a monk at the monastery of St. Macarius in Scetis", "I was beaten and lost an eye for defending the Orthodox faith", "I was sent into exile for refusing heretical communion", "I founded a monastery that still stands in the Fayoum", "I am called the Confessor and my monastery is El-Qalamoun"] },
  { name: "St. Karas the Anchorite", clues: ["I was the son of a king but chose the monastic life", "I lived alone in the deep desert for many years", "I wore no clothes and my hair grew to cover my body", "An angel brought me Holy Communion in the wilderness", "A monk found me near the end of my life and told my story"] },
  { name: "Abba Poemen", clues: ["My name means shepherd in Greek", "I was one of the most quoted of the Desert Fathers", "I lived in the desert of Scetis in the 4th and 5th centuries", "My sayings fill many pages of the collections of desert wisdom", "I taught that silence and humility are greater than any miracle"] },
  { name: "St. Isidore the Priest", clues: ["I was a priest and guestmaster at the monasteries of Scetis", "I was known for my extraordinary hospitality to visitors", "I never held anger against anyone even for a moment", "I served in the desert for many decades", "St. Palladius wrote about my virtues in his Lausiac History"] },
  { name: "St. Paphnutius", clues: ["I was a monk and bishop in the Egyptian desert", "I suffered greatly during the persecution losing an eye", "I attended the Council of Nicaea as a confessor", "I argued against a proposed rule of mandatory clerical celibacy at the council", "My wounds from persecution gave me great authority among the other bishops"] },
  // === MARTYRS ===
  { name: "St. George", clues: ["I was a soldier in the Roman army", "I am one of the most celebrated military saints", "I was martyred during the persecution of Diocletian", "I am known for enduring seven years of torture", "I am often depicted slaying a dragon"] },
  { name: "St. Mina (Menas)", clues: ["I was an Egyptian soldier in the Roman army", "I left the army to live as a hermit in the desert", "I publicly declared my Christian faith before a crowd", "My body was carried by a camel that stopped and would not move", "A famous monastery in Mariout bears my name and I am called the Wonder Worker"] },
  { name: "St. Marina the Martyr", clues: ["I was a young woman from Antioch of Pisidia", "My own father turned me in to the authorities", "I was tortured severely but angels healed my wounds", "I defeated a demon who appeared to me in prison", "I was martyred at age 15 during the reign of Diocletian"] },
  { name: "St. Demiana", clues: ["My father was a governor in Egypt", "I chose a life of virginity and prayer over marriage", "I lived with 40 other virgins in a palace my father built", "I encouraged my father to remain faithful when pressured to worship idols", "I and my 40 companions were all martyred together"] },
  { name: "St. Philopateer Mercurius (Abu Seifein)", clues: ["I was a soldier in the Roman army who became a commander", "An angel gave me a luminous sword to use in battle", "I refused to offer incense to pagan gods after a military victory", "I was tortured and martyred for my faith", "I am known as Abu Seifein meaning Father of Two Swords"] },
  { name: "St. Abanoub", clues: ["I was only 12 years old when I was martyred", "I lived during the persecution of Diocletian in Egypt", "I boldly confessed Christ before the governor", "I endured many tortures but never denied my faith", "I am beloved by Coptic children and known as the child martyr of Samanoud"] },
  { name: "St. Maurice", clues: ["I was a commander in the Roman army from Egypt", "I led a legion of Christian soldiers from Thebes", "My legion was ordered to sacrifice to Roman gods before battle", "We refused to worship idols even under threat of death", "I and the entire Theban Legion were martyred in Switzerland"] },
  { name: "St. Barbara", clues: ["My father locked me in a tower to keep me from the world", "I secretly became a Christian while in seclusion", "I asked for three windows in my tower to honor the Trinity", "My own father turned me over to the authorities for being Christian", "My father himself carried out my execution but was struck by lightning"] },
  { name: "St. Catherine of Alexandria", clues: ["I was a learned princess of Alexandria", "I debated 50 pagan philosophers and converted them all", "I was condemned to die on a spiked wheel", "The wheel miraculously broke when I touched it", "I was finally beheaded and angels carried my body to Mount Sinai"] },
  { name: "St. Cyprian and St. Justina", clues: ["One of us was a powerful sorcerer before conversion", "A young virgin's prayers defeated all magical attempts against her", "The sorcerer was so moved by the power of the Cross he converted", "We both became devoted Christians and were eventually ordained", "We were beheaded together on the same day"] },
  { name: "St. Cosmas and St. Damian", clues: ["We were twin brothers who practiced medicine", "We treated the sick without ever accepting payment", "We are known as the Unmercenaries or Silverless Ones", "We used our medical practice as a way to share the faith", "We were martyred together during the Diocletian persecution"] },
  { name: "St. Stephen the Protomartyr", clues: ["I was one of the first seven deacons chosen by the apostles", "I was known for performing great signs and wonders", "I gave a powerful speech recounting Israel's history before the council", "I saw the heavens opened and the Son of Man standing at God's right hand", "I was stoned to death becoming the first Christian martyr"] },
  { name: "St. Ignatius of Antioch", clues: ["I was a bishop who was a disciple of the apostles", "I wrote seven famous letters while being taken to my execution", "I said I am the wheat of God and must be ground by the teeth of beasts", "I longed for martyrdom and asked the Roman Christians not to prevent it", "I was thrown to wild lions in the Colosseum in Rome"] },
  { name: "St. Polycarp of Smyrna", clues: ["I was a disciple of the Apostle John", "I served as bishop for many decades", "When told to curse Christ I replied 86 years I have served Him and He never did me wrong", "I was burned at the stake but the flames would not touch me", "I was finally killed by a dagger and am one of the Apostolic Fathers"] },
  { name: "St. Perpetua and St. Felicity", clues: ["We were martyred in North Africa in the early 3rd century", "One of us was a young noblewoman who kept a diary in prison", "The other was a pregnant slave who gave birth just days before execution", "We refused to sacrifice to the emperor despite intense pressure", "We were thrown to wild beasts in the arena of Carthage"] },
  { name: "St. Victor (Boctor)", clues: ["I was an Egyptian soldier who refused to worship idols", "I endured many tortures in different cities across Egypt", "My mother Martham encouraged me during my sufferings", "I performed many miracles during my torture that converted thousands", "I am one of the most beloved soldier-martyrs in the Coptic Church"] },
  { name: "St. Menas (Mina) of Akhmim", clues: ["I was a young man from Akhmim in Upper Egypt", "I was known for my piety from childhood", "I was arrested during the persecution of Diocletian", "I endured extreme tortures with great patience", "I am different from St. Mina the Wonder Worker of Mariout"] },
  { name: "St. Clement of Rome", clues: ["I was the third or fourth Bishop of Rome", "I wrote an important letter to the Church in Corinth", "My letter is one of the earliest Christian documents outside the New Testament", "I was exiled to the mines and martyred by drowning", "An anchor is my symbol"] },
  { name: "St. Cyprian of Carthage", clues: ["I was a famous bishop in North Africa", "I wrote extensively about Church unity", "I said he cannot have God for his father who does not have the Church for his mother", "I dealt with the crisis of Christians who lapsed during persecution", "I was beheaded during the Valerian persecution"] },
  { name: "St. Justus (Yustus)", clues: ["I was a young child from Akhmim in Upper Egypt", "My father Theophilus and I were traveling when soldiers captured us", "Despite my young age I boldly professed my faith in Christ", "My father and I were both martyred", "I am one of the youngest martyrs commemorated in the Coptic Synaxarium"] },
  { name: "St. Apakir (Abadir) and St. Irene", clues: ["We were brother and sister from a noble family", "Our mother raised us in the Christian faith", "We traveled to Alexandria to confess our faith during the persecution", "We endured many tortures and performed miracles", "We were martyred together and our story is well-known in Upper Egypt"] },
  { name: "St. Dimyana and the 40 Virgins", clues: ["I was the daughter of Mark the governor of Burullus", "I consecrated my life to prayer and virginity", "40 virgins joined me in a life of worship", "When my father compromised his faith I urged him to repent", "All 41 of us were martyred when we refused to deny Christ"] },
  { name: "St. Wanas (Owanes)", clues: ["I was a soldier in the Roman army in Egypt", "I refused to worship idols and declared my faith openly", "I was tortured in several Egyptian cities", "My story is recorded in the Coptic Synaxarium with many miracles", "I am venerated as a military saint in the Coptic tradition"] },
  // === HOLY WOMEN ===
  { name: "St. Mary (the Theotokos)", clues: ["An angel appeared to me with news that changed human history", "I visited my relative Elizabeth while we were both expecting", "I pondered many things in my heart", "I was present at the Cross and entrusted to a beloved disciple", "I am called Theotokos the Mother of God and the Coptic Church celebrates many feasts in my honor"] },
  { name: "St. Mary Magdalene", clues: ["Jesus cast seven demons out of me", "I was among the women who supported Jesus' ministry", "I stood at the foot of the Cross", "I was the first to see the risen Christ on Easter morning", "Jesus told me to go tell the disciples He had risen"] },
  { name: "St. Verena", clues: ["I was born in Upper Egypt in the Theban region", "I traveled to Europe following the Theban Legion", "I taught local people about hygiene and caring for the sick", "I lived as a hermit in Switzerland", "I am the patron saint of Zurich depicted carrying a water jug and comb"] },
  { name: "St. Monica", clues: ["I prayed for decades for my wayward son to convert", "My tears and prayers were legendary in the early Church", "A bishop told me that the son of so many tears could not be lost", "My son eventually became one of the greatest Church Fathers", "I am the mother of St. Augustine of Hippo"] },
  { name: "St. Mary of Egypt", clues: ["I lived a sinful life for many years in Alexandria", "I tried to enter the Church of the Holy Sepulchre but an invisible force stopped me", "I repented before an icon of the Theotokos", "I crossed the Jordan and lived in the desert for 47 years in repentance", "A monk named Zosimas found me and gave me communion before I died"] },
  { name: "St. Sarah (Amma Sarah)", clues: ["I was one of the Desert Mothers of Egypt", "I lived beside a river for 60 years and never looked at it", "I fought against the demon of temptation for 13 years", "I told monks that I am a woman in nature but not in spirit", "I is one of the most quoted women in the sayings of the Desert Fathers and Mothers"] },
  { name: "St. Syncletica", clues: ["I was a wealthy woman from Alexandria", "I gave away all my possessions and became an ascetic", "I gathered other women around me for a communal life of prayer", "My teachings are collected alongside the Desert Fathers", "I am considered one of the great Desert Mothers of Egypt"] },
  { name: "St. Theodora of Alexandria", clues: ["I committed a sin and was filled with deep remorse", "I disguised myself as a man and entered a monastery to do penance", "I was falsely accused of fathering a child but accepted the blame in silence", "I raised the child as my own without revealing my identity", "My true gender was only discovered after my death"] },
  { name: "St. Hilaria", clues: ["I was the daughter of Emperor Zeno", "I secretly left the palace to live as a monk in Egypt", "I disguised myself as a man and was known as Brother Hilarion", "My own father sent my sister to my monastery for healing not knowing who I was", "My identity was only revealed upon my death"] },
  { name: "St. Anastasia", clues: ["I was a Roman woman who helped imprisoned Christians", "I visited the faithful in prison bringing them food and comfort", "I am called the Deliverer from Potions in some traditions", "I was martyred during the Diocletian persecution", "I am commemorated on December 25th in some calendars"] },
  // === BISHOPS & CHURCH FATHERS ===
  { name: "Anba Abraam (Bishop of Fayoum)", clues: ["I was known for extreme generosity to the poor", "I gave away everything the diocese had to those in need", "I performed many miracles during my lifetime", "I was a bishop in Egypt in the late 19th and early 20th century", "I am called the Friend of the Poor and served in Fayoum"] },
  { name: "St. John Chrysostom", clues: ["I was a priest in Antioch before being made a bishop", "I was famous for my powerful preaching and homilies", "I was exiled twice for criticizing the powerful", "My Paschal homily is read every year at the Resurrection feast", "My name means Golden Mouth"] },
  { name: "St. Basil the Great", clues: ["I was bishop of Caesarea in Cappadocia", "I wrote an influential rule for monastic life still used today", "I helped establish the doctrine of the Holy Trinity", "I was one of the three great Cappadocian Fathers", "The liturgy I composed is used in the Coptic Church throughout the year"] },
  { name: "St. Gregory the Theologian", clues: ["I was one of the three Cappadocian Fathers", "I served briefly as Archbishop of Constantinople", "I delivered five famous orations on the nature of God", "I preferred the contemplative life to Church politics", "I am one of only three people given the title Theologian in the Orthodox tradition"] },
  { name: "St. Severus of Antioch", clues: ["I was the Patriarch of Antioch in the 6th century", "I was exiled for my opposition to the Council of Chalcedon", "I spent many years in exile in Egypt", "I was a prolific writer of theological works and hymns", "I am one of the most important theologians in the Coptic Orthodox tradition"] },
  { name: "St. Clement of Alexandria", clues: ["I headed the famous Catechetical School of Alexandria", "I wrote works helping educated Greeks understand Christianity", "I saw Greek philosophy as a preparation for the Gospel", "My student Origen succeeded me at the school", "I am one of the earliest Christian intellectuals bridging faith and philosophy"] },
  { name: "Origen of Alexandria", clues: ["I was one of the most brilliant scholars of the early Church", "I led the Catechetical School of Alexandria", "I wrote thousands of works on Scripture and theology", "Some of my speculative ideas were later considered controversial", "I am known for creating the Hexapla a six-column comparison of Old Testament texts"] },
  { name: "St. Didymus the Blind", clues: ["I lost my sight at age four but became a great scholar", "I was appointed to lead the Catechetical School of Alexandria", "I taught many famous students through lectures from memory", "I mastered theology philosophy and mathematics despite my blindness", "St. Athanasius appointed me to lead the school in Alexandria"] },
  { name: "St. Ephrem the Syrian", clues: ["I was a deacon who never became a priest out of humility", "I wrote thousands of hymns and theological poems", "I used poetry and song to teach doctrine to the people", "I defended Orthodox teaching against various heresies", "I am called the Harp of the Holy Spirit"] },
  { name: "St. Augustine of Hippo", clues: ["I lived a wild youth in North Africa before converting", "My mother prayed for my conversion for many years", "I wrote Confessions and The City of God", "I heard a voice saying Take and read which led to my conversion", "I became Bishop of Hippo in North Africa"] },
  { name: "St. Jerome", clues: ["I was a scholar who lived in Bethlehem for many years", "I translated the Bible into Latin creating the Vulgate", "I was known for my fiery temperament and sharp writings", "I lived as a hermit in the Syrian desert for a time", "I am considered the greatest biblical scholar of the early Church"] },
  { name: "St. Ambrose of Milan", clues: ["I was a Roman governor before being chosen as bishop", "I was not yet baptized when the people demanded I become their bishop", "I confronted Emperor Theodosius and demanded he repent", "I was instrumental in the conversion of a famous African theologian", "I introduced congregational hymn singing in the Western Church"] },
  // === NOTABLE COPTIC SAINTS ===
  { name: "St. Simon the Tanner", clues: ["I lived in Cairo in the 10th century during the Fatimid Caliphate", "I was a simple craftsman who worked with leather", "The Caliph challenged the Pope to prove a verse about faith moving mountains", "Through my prayers and fasting a miracle occurred", "The Mokattam Mountain visibly moved three times and a church there honors me"] },
  { name: "St. Reweis (Rueis)", clues: ["I lived in the 19th century in Egypt", "I appeared to be a simple and foolish man to the world", "I lived a life of voluntary poverty and humility", "I had the gift of prophecy and performed many miracles", "I am known as a holy fool for Christ from the village of El-Bayadiya"] },
  { name: "Archdeacon Habib Girgis", clues: ["I was a pioneer of Sunday School education in the Coptic Church", "I established the first organized religious education program for youth", "I founded the Clerical College in Cairo", "I was never ordained as a priest but held the rank of Archdeacon", "I am considered the father of the modern Coptic Sunday School movement"] },
  { name: "St. Takla Haymanot", clues: ["I am the most beloved saint of the Ethiopian Church", "I was trained in Egypt before returning to my homeland", "I is said to have stood on one foot in prayer for seven years", "I helped spread Christianity throughout Ethiopia", "My name means Plant of Faith and I founded the monastery of Debre Libanos"] },
  { name: "St. Frumentius", clues: ["I was shipwrecked on the coast of Africa as a young man", "I served in the royal court and taught the faith to the prince", "I traveled to Alexandria to ask for a bishop to be sent", "St. Athanasius consecrated me as the first bishop of my country", "I am called the Apostle of Ethiopia also known as Abba Selama"] },
  { name: "St. Abraam the Syrian", clues: ["I was a wealthy merchant from Syria", "I gave away all my possessions to the poor", "I lived as a hermit in the Egyptian desert", "I was known for extreme generosity and love for the poor", "I am different from Anba Abraam Bishop of Fayoum"] },
  { name: "St. John of Scetis", clues: ["I was a monk and hegumen in the monastery of St. Macarius", "I was known for my deep spiritual discernment", "I served as a spiritual father to many monks", "I lived during the difficult period of the desert monasteries", "My life is recorded in the Synaxarium as a model of monastic virtue"] },
  { name: "St. Pijimi", clues: ["I was a soldier who became a monk and then a martyr", "I served in the Roman military before my conversion", "I left the army to live the monastic life in Egypt", "I was arrested during a persecution and refused to deny Christ", "I am commemorated as both a monastic and a military saint"] },
  // === CONFESSORS & ASCETICS ===
  { name: "St. Simeon the Stylite", clues: ["I was originally a shepherd in Syria", "I lived on top of a pillar for decades", "People came from far away to seek my counsel from below", "I inspired many imitators called stylites", "I spent 37 years on my pillar never coming down"] },
  { name: "St. Onuphrius (Nofer)", clues: ["I lived in the deep desert of Egypt for 60 years", "My only clothing was my long hair and beard", "An angel brought me bread and water daily", "A monk named Paphnutius found me and recorded my story", "When I died palm trees bent over my body to form a grave"] },
  { name: "St. Palaemon", clues: ["I was an elderly hermit in the Thebaid region of Egypt", "A young man came to me wanting to become a monk", "I warned him that the monastic life was extremely difficult", "I became the spiritual father and teacher of this young man", "My most famous disciple was St. Pachomius the father of cenobitic monasticism"] },
  { name: "St. Amoun of Nitria", clues: ["I was forced into marriage but convinced my wife to live in celibacy", "After 18 years my wife and I separated to pursue the monastic life", "I founded one of the most important monastic centers in Egypt", "St. Athanasius wrote about me in his Life of St. Anthony", "I established the monastic settlement of Nitria in the Egyptian desert"] },
  { name: "St. Pambo", clues: ["I was a disciple of St. Anthony the Great in the desert", "When I first came to learn a psalm I stopped at the first verse and spent years meditating on it", "I was known for never speaking hastily", "I worked with my hands weaving baskets to give to the poor", "When Melania the Elder visited me with silver I did not even look at it"] },
  { name: "St. Apollo of Scetis", clues: ["I lived in the desert as a hermit from my youth", "I gathered a community of hundreds of monks around me", "I was known for my joyful spirit and insisted monks should always be glad", "I said Christians should always be cheerful because the Lord has saved them", "I lived in the Thebaid and my community practiced both solitary and communal life"] },
  { name: "St. Serapion the Sindonite", clues: ["I owned nothing but a single linen cloth", "I sold even my copy of the Gospels to give to the poor", "When asked where my Gospel book was I said I sold the one that told me to sell everything", "I traveled everywhere with only my simple garment", "I am named the Sindonite after the sindon or linen cloth I wore"] },
  // === LATER COPTIC SAINTS ===
  { name: "Fr. Mikhail Ibrahim", clues: ["I was a priest martyred in the modern era", "I served in Upper Egypt and was known for my love of the poor", "I was killed for my faith in the 20th century", "My congregation deeply mourned my loss", "I am one of the modern Coptic martyrs commemorated by the Church"] },
  { name: "Fr. Mattaous El-Makary", clues: ["I was a monk at St. Macarius Monastery", "I was known for a deep prayer life and spiritual gifts", "I spent most of my time in his cell in prayer and contemplation", "I had the gift of tears and wept frequently during prayer", "I am revered as one of the great modern Coptic monks of Wadi El Natrun"] },
  { name: "Tamav Irene", clues: ["I was the spiritual mother of Pope Kyrillos VI", "I lived a life of extreme asceticism and prayer", "Many miracles were attributed to my intercessions", "I was a laywoman who lived a monastic-like life in the world", "I am one of the most revered modern Coptic holy women"] },
  { name: "St. Abraam of Fayoum", clues: ["I served as bishop in the late 1800s in Egypt", "I sold church furnishings to feed the hungry", "I trusted completely in God's providence for daily needs", "Miracles of provision happened regularly in my ministry", "I am called the Bishop of the Poor"] },
  // === EARLY MARTYRS & OTHERS ===
  { name: "St. Thecla", clues: ["I was converted by hearing an apostle preach from a window", "I broke off my engagement to follow Christ", "I survived multiple attempts at execution", "I lived as a hermit for many years after my escapes", "I am called the first female martyr and Equal to the Apostles"] },
  { name: "St. Menas the Musician", clues: ["I was a monk known for my beautiful voice and hymns", "I composed many Coptic hymns still sung today", "I served as a cantor in the Church", "My musical gifts were used to glorify God", "I am different from St. Mina the Wonder Worker"] },
  { name: "St. Julius of Akfahs", clues: ["I lived during the Diocletian persecution in Egypt", "I traveled throughout Egypt writing the stories of martyrs", "I used my wealth to care for the bodies of martyrs", "I provided proper burial for thousands of Christian martyrs", "I am called the recorder of the acts of the martyrs"] },
  { name: "St. Pisentius of Qift", clues: ["I was Bishop of Qift (Coptos) in Upper Egypt", "I was known for asceticism and spiritual visions", "I had encounters with demons and defeated them through prayer", "I was a scholar who spoke multiple languages", "I lived in the 6th-7th century and my homilies survive in Coptic"] },
  { name: "St. Misael (Mikhail)", clues: ["I was a young monk at a Coptic monastery", "I was known for my innocence and purity from childhood", "I was martyred at a young age for refusing to deny Christ", "My relics became a source of healing for many", "My story is preserved in the Coptic Synaxarium as one of the pure youth martyrs"] },
  { name: "St. Sarapamon of Scetis", clues: ["I was Bishop of Nikiu in Egypt", "I was known as the Veiled Bishop because I covered my face", "I covered my face so women would not see him and be tempted", "I was martyred during the Diocletian persecution", "I am one of the most unusual bishops in Coptic history"] },
  { name: "St. Abaskhyroun the Soldier", clues: ["I was a soldier in the Roman army stationed in Egypt", "I witnessed other Christians being martyred and was moved", "I threw down my military belt and declared myself a Christian", "I endured terrible tortures for my sudden confession of faith", "I am commemorated as one of the brave military martyrs"] },
  { name: "St. Winefride (Barnaba)", clues: ["I was an Egyptian monk who traveled to Ireland", "I helped spread monasticism in the British Isles", "Egyptian monastic traditions influenced Celtic Christianity through monks like me", "I lived during the age of missionary monks", "I represent the connection between Coptic and Celtic Christianity"] },
  { name: "St. John the Hegumen", clues: ["I was abbot of a monastery in Scetis", "I was captured by Berber raiders along with other monks", "I was taken into slavery but continued to pray and fast", "I eventually converted my captors to Christianity", "My story shows the power of faith even in captivity"] },
  { name: "St. Kyriakos (Cyriaque)", clues: ["I was a child martyr during the Diocletian persecution", "My mother Julitta brought me with her when she was arrested", "When the judge tried to comfort me I cried out that I was a Christian", "Despite my very young age I confessed Christ boldly", "I am one of the youngest martyrs in Christian history"] },
];



/* ============================================================
   BIBLE TRIVIA - DATA (expanded, includes Coptic questions)
   ============================================================ */
const TRIVIA_DATA = [
  { q: "How many days did God take to create the world?", a: "6", options: ["5", "6", "7", "8"] },
  { q: "What is the first book of the Bible?", a: "Genesis", options: ["Exodus", "Genesis", "Psalms", "Matthew"] },
  { q: "How many plagues did God send on Egypt?", a: "10", options: ["7", "9", "10", "12"] },
  { q: "Who built the ark?", a: "Noah", options: ["Moses", "Noah", "Abraham", "David"] },
  { q: "How many apostles did Jesus choose?", a: "12", options: ["7", "10", "12", "14"] },
  { q: "What was the first miracle of Jesus?", a: "Turning water into wine", options: ["Healing a blind man", "Walking on water", "Turning water into wine", "Feeding 5000"] },
  { q: "Who was swallowed by a great fish?", a: "Jonah", options: ["Elijah", "Jonah", "Daniel", "Jeremiah"] },
  { q: "How many books are in the Bible (Orthodox canon)?", a: "73", options: ["66", "73", "77", "81"] },
  { q: "What river was Jesus baptized in?", a: "Jordan", options: ["Nile", "Jordan", "Euphrates", "Tigris"] },
  { q: "Who baptized Jesus?", a: "John the Baptist", options: ["Peter", "John the Baptist", "Andrew", "James"] },
  { q: "Where was Jesus born?", a: "Bethlehem", options: ["Nazareth", "Jerusalem", "Bethlehem", "Capernaum"] },
  { q: "How many brothers did Joseph have?", a: "11", options: ["7", "10", "11", "12"] },
  { q: "What did God use to speak to Moses in the desert?", a: "A burning bush", options: ["A cloud", "A burning bush", "A dove", "An angel"] },
  { q: "Who killed Goliath?", a: "David", options: ["Saul", "David", "Jonathan", "Samuel"] },
  { q: "How many loaves and fish did Jesus use to feed the 5,000?", a: "5 loaves and 2 fish", options: ["3 loaves and 3 fish", "5 loaves and 2 fish", "7 loaves and 5 fish", "4 loaves and 2 fish"] },
  { q: "What is the last book of the Bible?", a: "Revelation", options: ["Jude", "3 John", "Revelation", "Acts"] },
  { q: "Which disciple betrayed Jesus?", a: "Judas Iscariot", options: ["Peter", "Thomas", "Judas Iscariot", "James"] },
  { q: "How many days was Jesus in the tomb?", a: "3", options: ["1", "2", "3", "4"] },
  { q: "Who was the first king of Israel?", a: "Saul", options: ["David", "Saul", "Solomon", "Samuel"] },
  { q: "What is the shortest verse in the Bible?", a: "Jesus wept", options: ["God is love", "Jesus wept", "Rejoice always", "Pray continually"] },
  { q: "Where did God give Moses the Ten Commandments?", a: "Mount Sinai", options: ["Mount Sinai", "Mount Carmel", "Mount Zion", "Mount Tabor"] },
  { q: "Who interpreted Pharaoh's dreams?", a: "Joseph", options: ["Moses", "Daniel", "Joseph", "Samuel"] },
  { q: "How many days and nights did it rain during the flood?", a: "40", options: ["7", "12", "30", "40"] },
  { q: "Who was thrown into a den of lions?", a: "Daniel", options: ["David", "Jonah", "Daniel", "Elijah"] },
  { q: "What city walls fell after the Israelites marched around them?", a: "Jericho", options: ["Jerusalem", "Jericho", "Bethel", "Ai"] },
  { q: "Which angel appeared to Mary?", a: "Gabriel", options: ["Michael", "Gabriel", "Raphael", "Uriel"] },
  { q: "Who was the oldest person in the Bible?", a: "Methuselah", options: ["Noah", "Adam", "Methuselah", "Enoch"] },
  { q: "Where did the Holy Family flee to escape King Herod?", a: "Egypt", options: ["Syria", "Jordan", "Egypt", "Lebanon"] },
  { q: "How many Gospels are there?", a: "4", options: ["3", "4", "5", "7"] },
  { q: "Who denied Jesus three times?", a: "Peter", options: ["James", "John", "Peter", "Thomas"] },
  { q: "Which sea did Moses part?", a: "The Red Sea", options: ["The Dead Sea", "The Red Sea", "The Sea of Galilee", "The Mediterranean"] },
  { q: "Who wrote most of the Psalms?", a: "David", options: ["Solomon", "Moses", "David", "Asaph"] },
  { q: "Who was the first martyr in the New Testament?", a: "St. Stephen", options: ["St. James", "St. Stephen", "St. Peter", "St. Paul"] },
  { q: "How many sons did Jacob have?", a: "12", options: ["10", "11", "12", "13"] },
  { q: "Which apostle was a tax collector?", a: "Matthew", options: ["Luke", "Matthew", "Mark", "John"] },
  { q: "What was Paul's name before his conversion?", a: "Saul", options: ["Simon", "Saul", "Stephen", "Silas"] },
  { q: "Who replaced Judas as the 12th apostle?", a: "Matthias", options: ["Paul", "Barnabas", "Matthias", "Timothy"] },
  { q: "How many days did Jesus fast in the wilderness?", a: "40", options: ["7", "30", "40", "50"] },
  { q: "Who was Moses' sister?", a: "Miriam", options: ["Deborah", "Ruth", "Miriam", "Naomi"] },
  { q: "Which prophet was taken to heaven in a chariot of fire?", a: "Elijah", options: ["Enoch", "Elijah", "Elisha", "Moses"] },
  { q: "What gift did the Magi NOT bring to Jesus?", a: "Silver", options: ["Gold", "Frankincense", "Myrrh", "Silver"] },
  { q: "Who led the Israelites into the Promised Land after Moses?", a: "Joshua", options: ["Aaron", "Caleb", "Joshua", "Gideon"] },
  { q: "What did Jesus ride into Jerusalem on Palm Sunday?", a: "A donkey", options: ["A horse", "A donkey", "A camel", "A chariot"] },
  { q: "Where did Jesus grow up?", a: "Nazareth", options: ["Bethlehem", "Jerusalem", "Nazareth", "Egypt"] },
  { q: "Which apostle is known as 'the beloved disciple'?", a: "John", options: ["Peter", "John", "James", "Andrew"] },
  { q: "What instrument did David play?", a: "Harp", options: ["Flute", "Trumpet", "Harp", "Drum"] },
  { q: "How many stones did David pick up to fight Goliath?", a: "5", options: ["1", "3", "5", "7"] },
  { q: "What language was most of the New Testament written in?", a: "Greek", options: ["Hebrew", "Aramaic", "Latin", "Greek"] },
  { q: "Who was the first person to see the risen Christ?", a: "Mary Magdalene", options: ["Peter", "Mary Magdalene", "John", "The Virgin Mary"] },
  // COPTIC & CHURCH HISTORY
  { q: "What does 'Theotokos' mean?", a: "God-bearer / Mother of God", options: ["Holy Virgin", "God-bearer / Mother of God", "Queen of Saints", "Mother of the Church"] },
  { q: "In which country did monasticism originate?", a: "Egypt", options: ["Israel", "Syria", "Egypt", "Greece"] },
  { q: "How many sacraments does the Coptic Orthodox Church have?", a: "7", options: ["3", "5", "7", "9"] },
  { q: "What is the Coptic New Year called?", a: "Nayrouz", options: ["Nayrouz", "Kiahk", "Toba", "Bashans"] },
  { q: "Who is the founder of the Coptic Church?", a: "St. Mark the Apostle", options: ["St. Peter", "St. Mark the Apostle", "St. Paul", "St. Athanasius"] },
  { q: "What council defended that Christ is fully God?", a: "Council of Nicaea (325 AD)", options: ["Council of Nicaea (325 AD)", "Council of Ephesus (431 AD)", "Council of Chalcedon (451 AD)", "Council of Constantinople (381 AD)"] },
  { q: "What is the Coptic word for 'cross'?", a: "Stavros", options: ["Christos", "Stavros", "Agios", "Theos"] },
  { q: "Which Coptic month is devoted to praising the Virgin Mary?", a: "Kiahk", options: ["Toba", "Kiahk", "Bashans", "Paone"] },
  { q: "Where is the Coptic Pope traditionally chosen?", a: "St. Macarius Monastery", options: ["St. Anthony Monastery", "St. Macarius Monastery", "St. Bishoy Monastery", "The Cathedral in Cairo"] },
  { q: "What heresy did St. Athanasius fight against?", a: "Arianism", options: ["Nestorianism", "Arianism", "Gnosticism", "Pelagianism"] },
  { q: "Who was called the Father of All Monks?", a: "St. Anthony the Great", options: ["St. Paul the Hermit", "St. Anthony the Great", "St. Macarius", "St. Pachomius"] },
  { q: "How many times was St. Athanasius exiled?", a: "5", options: ["3", "4", "5", "7"] },
  { q: "What is the name of the Coptic liturgy most commonly used?", a: "Liturgy of St. Basil", options: ["Liturgy of St. Mark", "Liturgy of St. Gregory", "Liturgy of St. Basil", "Liturgy of St. Cyril"] },
  { q: "What mountain moved by faith in Coptic history?", a: "Mokattam Mountain", options: ["Mount Sinai", "Mokattam Mountain", "Mount Carmel", "Mount Tabor"] },
  { q: "Who moved the Mokattam Mountain through prayer?", a: "St. Simon the Tanner", options: ["Pope Abraham", "St. Simon the Tanner", "St. Mina", "Pope Kyrillos VI"] },
  { q: "What title is the head of the Coptic Church given?", a: "Pope of Alexandria and Patriarch of All Africa", options: ["Patriarch of Egypt", "Pope of Alexandria and Patriarch of All Africa", "Archbishop of Cairo", "Metropolitan of Egypt"] },
  { q: "The Council of Ephesus (431 AD) defended what title for the Virgin Mary?", a: "Theotokos", options: ["Theotokos", "Christotokos", "Panagia", "Ever-Virgin"] },
  { q: "What is the Agpeya?", a: "The Coptic book of hours/prayers", options: ["A hymn book", "The Coptic book of hours/prayers", "A book of saints' lives", "The Coptic Bible"] },
  { q: "What does 'Coptic' mean?", a: "Egyptian", options: ["Christian", "Egyptian", "Orthodox", "Ancient"] },
  { q: "What desert region is home to the four ancient Coptic monasteries?", a: "Wadi El Natrun", options: ["Western Desert", "Wadi El Natrun", "Eastern Desert", "Sinai Peninsula"] },
  { q: "What church father wrote 'On the Incarnation'?", a: "St. Athanasius", options: ["St. Cyril", "St. Athanasius", "St. Basil", "St. John Chrysostom"] },
  { q: "What is the Synaxarium?", a: "The book of saints' lives read daily in church", options: ["A prayer book", "The book of saints' lives read daily in church", "The Coptic hymn book", "A book of theology"] },
  { q: "Which saint's body remains incorrupt in Wadi El Natrun?", a: "St. Bishoy", options: ["St. Macarius", "St. Bishoy", "St. Moses", "St. Anthony"] },
  { q: "What is the Great Lent in the Coptic Church?", a: "55 days of fasting before Easter", options: ["40 days of fasting", "55 days of fasting before Easter", "50 days of fasting", "49 days of fasting"] },
  { q: "Who organized monks into communal living for the first time?", a: "St. Pachomius", options: ["St. Anthony", "St. Macarius", "St. Pachomius", "St. Paul"] },
  { q: "What year was the Council of Nicaea?", a: "325 AD", options: ["125 AD", "225 AD", "325 AD", "425 AD"] },
  { q: "What is the Feast of the Cross called in Coptic?", a: "Eid El Salib", options: ["Eid El Nayrouz", "Eid El Salib", "Eid El Ghitas", "Eid El Qiyama"] },
  { q: "How many fasting days does the Coptic Church observe per year?", a: "Over 200", options: ["About 100", "About 150", "Over 200", "About 250"] },
  { q: "What did Arius teach that St. Athanasius opposed?", a: "That Christ was a created being", options: ["That Christ was only human", "That Christ was a created being", "That the Holy Spirit was not God", "That Mary was not the Mother of God"] },
  { q: "Which pope built St. Mark's Cathedral in Cairo?", a: "Pope Kyrillos VI", options: ["Pope Shenouda III", "Pope Kyrillos VI", "Pope Yousab II", "Pope Christodoulos"] },
  { q: "What does 'Liturgy' mean?", a: "Work of the people / public service", options: ["Holy prayer", "Work of the people / public service", "Sacred meal", "Divine mystery"] },
  { q: "Where was St. Paul when he was converted?", a: "Road to Damascus", options: ["Jerusalem", "Road to Damascus", "Antioch", "Tarsus"] },
  { q: "What was the name of Abraham's son born to Hagar?", a: "Ishmael", options: ["Isaac", "Ishmael", "Esau", "Jacob"] },
  { q: "Who was the wife of Isaac?", a: "Rebecca", options: ["Sarah", "Rachel", "Rebecca", "Leah"] },
  { q: "What did Jacob's name become after wrestling with God?", a: "Israel", options: ["Judah", "Israel", "Abraham", "Moses"] },
  { q: "Who was sold into slavery by his brothers?", a: "Joseph", options: ["Benjamin", "Joseph", "David", "Daniel"] },
  { q: "How many commandments did God give Moses?", a: "10", options: ["5", "7", "10", "12"] },
  { q: "What did Samson lose when his hair was cut?", a: "His strength", options: ["His sight", "His strength", "His wisdom", "His faith"] },
  { q: "Who anointed David as king?", a: "Samuel", options: ["Moses", "Elijah", "Samuel", "Nathan"] },
  { q: "What prayer did Jesus teach His disciples?", a: "The Lord's Prayer", options: ["The Psalms", "The Lord's Prayer", "The Creed", "The Agpeya"] },
  { q: "How many books did Paul write in the New Testament?", a: "13-14", options: ["7", "10", "13-14", "21"] },
  { q: "What was the occupation of Jesus' earthly father Joseph?", a: "Carpenter", options: ["Fisherman", "Carpenter", "Tax collector", "Shepherd"] },
  { q: "What miracle happened at Pentecost?", a: "The Holy Spirit descended on the apostles", options: ["Jesus was transfigured", "The Holy Spirit descended on the apostles", "The temple veil was torn", "Water turned to wine"] },
  { q: "What are the three Theological Virtues?", a: "Faith, Hope, and Love", options: ["Faith, Hope, and Love", "Truth, Grace, and Mercy", "Prayer, Fasting, and Almsgiving", "Humility, Obedience, and Chastity"] },
  { q: "Where is the oldest Christian monastery in the world?", a: "St. Anthony's Monastery, Egypt", options: ["Mount Athos, Greece", "St. Anthony's Monastery, Egypt", "Mar Saba, Palestine", "St. Catherine's, Sinai"] },
  { q: "What is Pascha?", a: "Easter / the Resurrection Feast", options: ["Christmas", "Easter / the Resurrection Feast", "Pentecost", "Palm Sunday"] },
  { q: "What is the Trisagion?", a: "Holy God, Holy Mighty, Holy Immortal", options: ["The Lord's Prayer", "Holy God, Holy Mighty, Holy Immortal", "The Nicene Creed", "Glory to God in the highest"] },
];



/* ============================================================
   GAME 2: WHO SAID IT (no ref shown until after answer)
   ============================================================ */
function WhoSaidItGame({ onBack }) {
  const [questions, setQuestions] = useState([]);
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [done, setDone] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const NUM_Q = 20;

  useEffect(() => {
    const shuffled = shuffle(WHO_SAID_IT_DATA).slice(0, NUM_Q);
    const withOptions = shuffled.map(q => {
      const wrong = shuffle(SPEAKERS.filter(s => s !== q.speaker)).slice(0, 3);
      return { ...q, options: shuffle([q.speaker, ...wrong]) };
    });
    setQuestions(withOptions);
  }, []);

  const handlePick = (opt) => {
    if (showResult) return;
    setSelected(opt);
    setShowResult(true);
    setTotal(t => t + 1);
    const correct = opt === questions[qi].speaker;
    if (correct) {
      setScore(s => s + 1);
      setStreak(s => { const n = s + 1; setBestStreak(b => Math.max(b, n)); return n; });
    } else { setStreak(0); }
  };

  const handleNext = () => {
    if (qi + 1 >= questions.length) { setDone(true); }
    else { setQi(qi + 1); setSelected(null); setShowResult(false); }
  };

  if (!questions.length) return <AppShell><div style={{ padding: 40, color: "#8b6930" }}>Loading...</div></AppShell>;

  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
  const cur = questions[qi];

  return (
    <AppShell>
      <div style={{ maxWidth: 560, width: "100%", padding: "24px 20px", animation: "fadeInUp 0.5s ease-out" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <BackButton onClick={onBack} />
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: 12, fontWeight: 600, color: "#8b6930", letterSpacing: 1 }}>WHO SAID IT?</span>
          <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 15, color: "#8b6930" }}>{qi + 1}/{questions.length}</span>
        </div>

        {!done ? (
          <>
            <div style={{ display: "flex", justifyContent: "center", gap: 28, marginBottom: 20, padding: "8px 0", borderTop: "1px solid rgba(139,90,43,0.12)", borderBottom: "1px solid rgba(139,90,43,0.12)" }}>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 20, fontWeight: 600, color: "#3e2409" }}>{accuracy}%</div><div style={{ fontSize: 11, color: "#a08050" }}>Accuracy</div></div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 20, fontWeight: 600, color: streak >= 3 ? "#6aae7a" : "#3e2409" }}>{streak}{streak >= 3 ? " 🔥" : ""}</div><div style={{ fontSize: 11, color: "#a08050" }}>Streak</div></div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 20, fontWeight: 600, color: "#3e2409" }}>{score}</div><div style={{ fontSize: 11, color: "#a08050" }}>Correct</div></div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.5)", borderRadius: 20, padding: "28px 24px", marginBottom: 24, border: "1px solid rgba(139,90,43,0.1)", boxShadow: "0 4px 24px rgba(139,90,43,0.06)", textAlign: "center" }}>
              <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 22, fontWeight: 500, color: "#3e2409", lineHeight: 1.5, fontStyle: "italic" }}>
                "{cur.quote}"
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {cur.options.map((opt, i) => {
                const isCorrect = showResult && opt === cur.speaker;
                const isWrong = showResult && opt === selected && opt !== cur.speaker;
                return (
                  <button key={i} onClick={() => handlePick(opt)} style={{
                    padding: "16px 12px", borderRadius: 14, border: "none", cursor: showResult ? "default" : "pointer",
                    fontFamily: "'Cinzel', serif", fontSize: 14, fontWeight: 600,
                    color: isCorrect ? "#fdf6e3" : isWrong ? "#fdf6e3" : "#3e2409",
                    background: isCorrect ? "linear-gradient(135deg, #6aae7a, #4d9060)" : isWrong ? "linear-gradient(135deg, #dc7a84, #c0606a)" : "linear-gradient(135deg, #f5e6c8, #edd9b5)",
                    boxShadow: isCorrect ? "0 4px 16px rgba(106,174,122,0.3)" : isWrong ? "0 4px 16px rgba(220,122,132,0.3)" : "0 3px 12px rgba(139,90,43,0.12)",
                    transition: "all 0.2s",
                    transform: isCorrect ? "scale(1.05)" : isWrong ? "scale(0.95)" : "none",
                    animation: isWrong ? "shake 0.4s ease-in-out" : "none",
                  }}>{opt}</button>
                );
              })}
            </div>

            {showResult && (
              <div style={{ textAlign: "center", animation: "fadeInUp 0.3s ease-out" }}>
                <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, color: selected === cur.speaker ? "#2d6a3f" : "#842029", fontWeight: 600, marginBottom: 8 }}>
                  {selected === cur.speaker ? "✓ Correct!" : `✗ It was ${cur.speaker}`}
                </div>
                <button onClick={handleNext} style={{ padding: "12px 32px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #8b6930, #6a4f20)", color: "#fdf6e3", fontFamily: "'Cinzel', serif", fontSize: 14, fontWeight: 600, cursor: "pointer", letterSpacing: 1 }}>
                  {qi + 1 < questions.length ? "NEXT →" : "VIEW RESULTS"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: "center", animation: "celebrateIn 0.5s ease-out" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>{accuracy >= 90 ? "🏆" : accuracy >= 70 ? "⭐" : "📖"}</div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 26, fontWeight: 700, color: "#3e2409", margin: "0 0 6px" }}>Complete!</h2>
            <div style={{ background: "rgba(255,255,255,0.5)", borderRadius: 20, padding: "24px 20px", margin: "24px 0", border: "1px solid rgba(139,90,43,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "center", gap: 36 }}>
                <div><div style={{ fontSize: 36, fontWeight: 700, color: "#3e2409" }}>{accuracy}%</div><div style={{ fontSize: 13, color: "#a08050" }}>Accuracy</div></div>
                <div><div style={{ fontSize: 36, fontWeight: 700, color: "#3e2409" }}>{score}/{total}</div><div style={{ fontSize: 13, color: "#a08050" }}>Correct</div></div>
                <div><div style={{ fontSize: 36, fontWeight: 700, color: "#3e2409" }}>{bestStreak}</div><div style={{ fontSize: 13, color: "#a08050" }}>Best Streak</div></div>
              </div>
            </div>
            <button onClick={onBack} style={{ padding: "14px 36px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #8b6930, #6a4f20)", color: "#fdf6e3", fontFamily: "'Cinzel', serif", fontSize: 15, fontWeight: 600, cursor: "pointer", letterSpacing: 1.5, boxShadow: "0 4px 20px rgba(139,90,43,0.25)" }}>BACK TO MENU</button>
          </div>
        )}
      </div>
    </AppShell>
  );
}

/* ============================================================
   GAME 3: GUESS THE SAINT (with educational blurb after answer)
   ============================================================ */
function GuessTheSaintGame({ onBack }) {
  const [saints, setSaints] = useState([]);
  const [si, setSi] = useState(0);
  const [revealedClues, setRevealedClues] = useState(1);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [done, setDone] = useState(false);
  const NUM_SAINTS = 15;

  useEffect(() => {
    const shuffled = shuffle(SAINTS_DATA).slice(0, NUM_SAINTS);
    setSaints(shuffled);
    if (shuffled.length) genOptions(shuffled, 0);
  }, []);

  const genOptions = (pool, idx) => {
    const correct = pool[idx].name;
    const allNames = SAINTS_DATA.map(s => s.name);
    const wrong = shuffle(allNames.filter(n => n !== correct)).slice(0, 3);
    setOptions(shuffle([correct, ...wrong]));
  };

  const handleReveal = () => {
    if (revealedClues < saints[si].clues.length) setRevealedClues(r => r + 1);
  };

  const handlePick = (opt) => {
    if (showResult) return;
    setSelected(opt);
    setShowResult(true);
    const correct = opt === saints[si].name;
    if (correct) {
      const points = Math.max(1, 6 - revealedClues);
      setScore(s => s + 1);
      setTotalPoints(tp => tp + points);
    }
  };

  const handleNext = () => {
    if (si + 1 >= saints.length) { setDone(true); }
    else {
      const next = si + 1;
      setSi(next); setRevealedClues(1); setSelected(null); setShowResult(false);
      genOptions(saints, next);
    }
  };

  if (!saints.length) return <AppShell><div style={{ padding: 40, color: "#8b6930" }}>Loading...</div></AppShell>;

  const cur = saints[si];
  const maxPoints = NUM_SAINTS * 5;

  return (
    <AppShell>
      <div style={{ maxWidth: 560, width: "100%", padding: "24px 20px", animation: "fadeInUp 0.5s ease-out" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <BackButton onClick={onBack} />
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: 12, fontWeight: 600, color: "#8b6930", letterSpacing: 1 }}>GUESS THE SAINT</span>
          <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 15, color: "#8b6930" }}>{si + 1}/{saints.length}</span>
        </div>

        {!done ? (
          <>
            <div style={{ display: "flex", justifyContent: "center", gap: 28, marginBottom: 20, padding: "8px 0", borderTop: "1px solid rgba(139,90,43,0.12)", borderBottom: "1px solid rgba(139,90,43,0.12)" }}>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 20, fontWeight: 600, color: "#3e2409" }}>{totalPoints}</div><div style={{ fontSize: 11, color: "#a08050" }}>Points</div></div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 20, fontWeight: 600, color: "#3e2409" }}>{score}</div><div style={{ fontSize: 11, color: "#a08050" }}>Correct</div></div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 20, fontWeight: 600, color: revealedClues <= 2 ? "#6aae7a" : "#3e2409" }}>{Math.max(1, 6 - revealedClues)}</div><div style={{ fontSize: 11, color: "#a08050" }}>Points if correct</div></div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.5)", borderRadius: 20, padding: "20px 20px", marginBottom: 20, border: "1px solid rgba(139,90,43,0.1)", boxShadow: "0 4px 24px rgba(139,90,43,0.06)" }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 12, fontWeight: 600, color: "#a08050", letterSpacing: 2, marginBottom: 14, textTransform: "uppercase", textAlign: "center" }}>Clues</div>
              {cur.clues.slice(0, revealedClues).map((clue, i) => (
                <div key={i} style={{ padding: "10px 0", borderBottom: i < revealedClues - 1 ? "1px solid rgba(139,90,43,0.08)" : "none", fontFamily: "'EB Garamond', serif", fontSize: 18, color: "#3e2409", lineHeight: 1.5, animation: "revealIn 0.4s ease-out" }}>
                  <span style={{ color: "#8b6930", fontWeight: 600, marginRight: 8 }}>{i + 1}.</span>{clue}
                </div>
              ))}
              {revealedClues < cur.clues.length && !showResult && (
                <button onClick={handleReveal} style={{ marginTop: 14, width: "100%", padding: "10px", borderRadius: 10, border: "1.5px dashed rgba(139,90,43,0.3)", background: "rgba(139,90,43,0.04)", cursor: "pointer", fontFamily: "'EB Garamond', serif", fontSize: 15, color: "#8b6930" }}>
                  Reveal next clue (-1 point) →
                </button>
              )}
            </div>

            {!showResult ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {options.map((opt, i) => (
                  <button key={i} onClick={() => handlePick(opt)} style={{
                    padding: "14px 18px", borderRadius: 14, border: "none", cursor: "pointer",
                    fontFamily: "'EB Garamond', serif", fontSize: 17, fontWeight: 500, textAlign: "left",
                    color: "#3e2409", background: "linear-gradient(135deg, #f5e6c8, #edd9b5)",
                    boxShadow: "0 3px 12px rgba(139,90,43,0.1)", transition: "all 0.2s",
                  }}>{opt}</button>
                ))}
              </div>
            ) : (
              <div style={{ animation: "fadeInUp 0.4s ease-out" }}>
                {/* Correct/wrong indicator */}
                <div style={{ textAlign: "center", marginBottom: 12 }}>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: 20, fontWeight: 700, color: selected === cur.name ? "#2d6a3f" : "#842029", marginBottom: 4 }}>
                    {selected === cur.name ? "✓ Correct!" : "✗ Incorrect"}
                  </div>
                  {selected !== cur.name && (
                    <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, color: "#5a3a1a" }}>It was <strong>{cur.name}</strong></div>
                  )}
                </div>

                {/* Educational blurb */}
                <div style={{ background: "rgba(139,90,43,0.06)", borderRadius: 16, padding: "18px 18px", marginBottom: 16, border: "1px solid rgba(139,90,43,0.12)" }}>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: 13, fontWeight: 600, color: "#8b6930", letterSpacing: 1, marginBottom: 8 }}>☦ DID YOU KNOW?</div>
                  <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, color: "#3e2409", lineHeight: 1.6 }}>{cur.blurb}</div>
                </div>

                <div style={{ textAlign: "center" }}>
                  <button onClick={handleNext} style={{ padding: "12px 32px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #8b6930, #6a4f20)", color: "#fdf6e3", fontFamily: "'Cinzel', serif", fontSize: 14, fontWeight: 600, cursor: "pointer", letterSpacing: 1 }}>
                    {si + 1 < saints.length ? "NEXT SAINT →" : "VIEW RESULTS"}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: "center", animation: "celebrateIn 0.5s ease-out" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>{score >= NUM_SAINTS * 0.9 ? "🏆" : score >= NUM_SAINTS * 0.7 ? "⭐" : "📖"}</div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 26, fontWeight: 700, color: "#3e2409", margin: "0 0 6px" }}>Complete!</h2>
            <div style={{ background: "rgba(255,255,255,0.5)", borderRadius: 20, padding: "24px 20px", margin: "24px 0", border: "1px solid rgba(139,90,43,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "center", gap: 36 }}>
                <div><div style={{ fontSize: 36, fontWeight: 700, color: "#3e2409" }}>{score}/{saints.length}</div><div style={{ fontSize: 13, color: "#a08050" }}>Correct</div></div>
                <div><div style={{ fontSize: 36, fontWeight: 700, color: "#3e2409" }}>{totalPoints}</div><div style={{ fontSize: 13, color: "#a08050" }}>Points</div></div>
                <div><div style={{ fontSize: 36, fontWeight: 700, color: "#a08050" }}>{maxPoints}</div><div style={{ fontSize: 13, color: "#a08050" }}>Max Possible</div></div>
              </div>
            </div>
            <div style={{ fontStyle: "italic", fontSize: 16, color: "#8b6930", marginBottom: 24, lineHeight: 1.6 }}>Fewer clues = more points. The saints intercede for us!</div>
            <button onClick={onBack} style={{ padding: "14px 36px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #8b6930, #6a4f20)", color: "#fdf6e3", fontFamily: "'Cinzel', serif", fontSize: 15, fontWeight: 600, cursor: "pointer", letterSpacing: 1.5, boxShadow: "0 4px 20px rgba(139,90,43,0.25)" }}>BACK TO MENU</button>
          </div>
        )}
      </div>
    </AppShell>
  );
}

/* ============================================================
   GAME 4: BIBLE TRIVIA (RAPID FIRE)
   ============================================================ */
function BibleTriviaGame({ onBack }) {
  const [questions, setQuestions] = useState([]);
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [done, setDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  const [started, setStarted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [answered, setAnswered] = useState(0);

  useEffect(() => { setQuestions(shuffle(TRIVIA_DATA)); }, []);

  useEffect(() => {
    if (!started || done) return;
    if (timeLeft <= 0) { setDone(true); return; }
    const t = setTimeout(() => setTimeLeft(tl => tl - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, started, done]);

  const handlePick = (opt) => {
    if (showResult || done) return;
    setSelected(opt); setShowResult(true); setAnswered(a => a + 1);
    const correct = opt === questions[qi].a;
    if (correct) { setScore(s => s + 1); setStreak(s => { const n = s + 1; setBestStreak(b => Math.max(b, n)); return n; }); }
    else { setStreak(0); }
    setTimeout(() => {
      if (qi + 1 >= questions.length) { setDone(true); }
      else { setQi(qi + 1); setSelected(null); setShowResult(false); }
    }, 800);
  };

  if (!questions.length) return <AppShell><div style={{ padding: 40, color: "#8b6930" }}>Loading...</div></AppShell>;

  const accuracy = answered > 0 ? Math.round((score / answered) * 100) : 0;
  const cur = questions[qi];
  const timerColor = timeLeft <= 10 ? "#dc7a84" : timeLeft <= 20 ? "#d4a843" : "#6aae7a";

  return (
    <AppShell>
      <div style={{ maxWidth: 560, width: "100%", padding: "24px 20px", animation: "fadeInUp 0.5s ease-out" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <BackButton onClick={onBack} />
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: 12, fontWeight: 600, color: "#8b6930", letterSpacing: 1 }}>BIBLE TRIVIA</span>
          {started && !done && <span style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 700, color: timerColor, animation: timeLeft <= 10 ? "countIn 1s ease-in-out infinite" : "none" }}>{timeLeft}s</span>}
        </div>

        {!started ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>⚡</div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 24, fontWeight: 700, color: "#3e2409", margin: "0 0 8px" }}>Rapid Fire</h2>
            <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 18, color: "#8b6930", marginBottom: 32, lineHeight: 1.5 }}>Answer as many Bible &amp; Coptic trivia questions as you can in 90 seconds!</p>
            <button onClick={() => setStarted(true)} style={{ padding: "16px 48px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #6aae7a, #4d9060)", color: "#fff", fontFamily: "'Cinzel', serif", fontSize: 18, fontWeight: 600, cursor: "pointer", letterSpacing: 1, boxShadow: "0 4px 20px rgba(106,174,122,0.3)" }}>START</button>
          </div>
        ) : !done ? (
          <>
            <div style={{ display: "flex", justifyContent: "center", gap: 28, marginBottom: 20, padding: "8px 0", borderTop: "1px solid rgba(139,90,43,0.12)", borderBottom: "1px solid rgba(139,90,43,0.12)" }}>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 20, fontWeight: 600, color: "#3e2409" }}>{score}</div><div style={{ fontSize: 11, color: "#a08050" }}>Correct</div></div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 20, fontWeight: 600, color: streak >= 3 ? "#6aae7a" : "#3e2409" }}>{streak}{streak >= 3 ? " 🔥" : ""}</div><div style={{ fontSize: 11, color: "#a08050" }}>Streak</div></div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 20, fontWeight: 600, color: "#3e2409" }}>{answered}</div><div style={{ fontSize: 11, color: "#a08050" }}>Answered</div></div>
            </div>
            <div style={{ width: "100%", height: 6, background: "rgba(139,90,43,0.1)", borderRadius: 3, marginBottom: 20, overflow: "hidden" }}>
              <div style={{ width: `${(timeLeft / 90) * 100}%`, height: "100%", background: timerColor, borderRadius: 3, transition: "width 1s linear" }} />
            </div>
            <div style={{ background: "rgba(255,255,255,0.5)", borderRadius: 20, padding: "24px 20px", marginBottom: 20, border: "1px solid rgba(139,90,43,0.1)", textAlign: "center" }}>
              <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 20, fontWeight: 500, color: "#3e2409", lineHeight: 1.5 }}>{cur.q}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {cur.options.map((opt, i) => {
                const isCorrect = showResult && opt === cur.a;
                const isWrong = showResult && opt === selected && opt !== cur.a;
                return (
                  <button key={i} onClick={() => handlePick(opt)} style={{
                    padding: "14px 18px", borderRadius: 14, border: "none", cursor: showResult ? "default" : "pointer",
                    fontFamily: "'EB Garamond', serif", fontSize: 17, fontWeight: 500, textAlign: "left",
                    color: isCorrect ? "#fdf6e3" : isWrong ? "#fdf6e3" : "#3e2409",
                    background: isCorrect ? "linear-gradient(135deg, #6aae7a, #4d9060)" : isWrong ? "linear-gradient(135deg, #dc7a84, #c0606a)" : "linear-gradient(135deg, #f5e6c8, #edd9b5)",
                    transition: "all 0.15s", transform: isCorrect ? "scale(1.02)" : isWrong ? "scale(0.98)" : "none",
                  }}>{opt}</button>
                );
              })}
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", animation: "celebrateIn 0.5s ease-out" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>{score >= 20 ? "🏆" : score >= 12 ? "⭐" : "📖"}</div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 26, fontWeight: 700, color: "#3e2409", margin: "0 0 6px" }}>Time's Up!</h2>
            <div style={{ background: "rgba(255,255,255,0.5)", borderRadius: 20, padding: "24px 20px", margin: "24px 0", border: "1px solid rgba(139,90,43,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "center", gap: 28 }}>
                <div><div style={{ fontSize: 36, fontWeight: 700, color: "#3e2409" }}>{score}</div><div style={{ fontSize: 13, color: "#a08050" }}>Correct</div></div>
                <div><div style={{ fontSize: 36, fontWeight: 700, color: "#3e2409" }}>{accuracy}%</div><div style={{ fontSize: 13, color: "#a08050" }}>Accuracy</div></div>
                <div><div style={{ fontSize: 36, fontWeight: 700, color: "#3e2409" }}>{bestStreak}</div><div style={{ fontSize: 13, color: "#a08050" }}>Best Streak</div></div>
                <div><div style={{ fontSize: 36, fontWeight: 700, color: "#3e2409" }}>{answered}</div><div style={{ fontSize: 13, color: "#a08050" }}>Answered</div></div>
              </div>
            </div>
            <button onClick={onBack} style={{ padding: "14px 36px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #8b6930, #6a4f20)", color: "#fdf6e3", fontFamily: "'Cinzel', serif", fontSize: 15, fontWeight: 600, cursor: "pointer", letterSpacing: 1.5, boxShadow: "0 4px 20px rgba(139,90,43,0.25)" }}>BACK TO MENU</button>
          </div>
        )}
      </div>
    </AppShell>
  );
}

/* ============================================================
   HOME SCREEN
   ============================================================ */
function HomeScreen({ onSelectGame }) {
  const games = [
    { id: "verses", icon: "\u{1F4D6}", title: "Verse by Verse", desc: "Memorize Scripture with drag & drop", color: "#6aae7a", count: "354 verses" },
    { id: "whosaid", icon: "\u{1F4AC}", title: "Who Said It?", desc: "Scripture & Church Fathers \u2014 who said this quote?", color: "#d4a843", count: `${WHO_SAID_IT_DATA.length} quotes` },
    { id: "saints", icon: "\u2626", title: "Guess the Saint", desc: "Learn about Coptic saints from the Synaxarium", color: "#c07a4a", count: `${SAINTS_DATA.length} saints` },
    { id: "trivia", icon: "\u26A1", title: "Bible Trivia", desc: "Rapid fire \u2014 90 seconds on the clock", color: "#8b6930", count: `${TRIVIA_DATA.length} questions` },
  ];

  return (
    <AppShell>
      <div style={{ maxWidth: 540, width: "100%", padding: "36px 24px", animation: "fadeInUp 0.6s ease-out" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 52, marginBottom: 8, filter: "grayscale(0.2)" }}>\u271D</div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 28, fontWeight: 700, color: "#3e2409", margin: "0 0 4px", letterSpacing: 2 }}>BIBLE GAMES</h1>
          <p style={{ fontSize: 16, color: "#8b6930", fontStyle: "italic", margin: 0 }}>Learn, play, and grow in faith</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {games.map((game, i) => (
            <button
              key={game.id}
              onClick={() => onSelectGame(game.id)}
              style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "20px 20px", borderRadius: 18, border: "none", cursor: "pointer",
                background: "rgba(255,255,255,0.5)",
                boxShadow: "0 4px 20px rgba(139,90,43,0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
                textAlign: "left", width: "100%",
                animation: `fadeInUp ${0.3 + i * 0.1}s ease-out`,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(139,90,43,0.18)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(139,90,43,0.1)"; }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, background: `linear-gradient(135deg, ${game.color}22, ${game.color}11)`,
                border: `2px solid ${game.color}33`, flexShrink: 0,
              }}>{game.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 16, fontWeight: 600, color: "#3e2409", marginBottom: 2 }}>{game.title}</div>
                <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, color: "#8b6930", marginBottom: 2 }}>{game.desc}</div>
                <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 12, color: "#a08050" }}>{game.count}</div>
              </div>
              <div style={{ fontSize: 18, color: "#c0a070" }}>\u2192</div>
            </button>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 28, fontFamily: "'EB Garamond', serif", fontSize: 14, color: "#a08050", fontStyle: "italic" }}>
          \u2626 Coptic Orthodox Edition
        </div>
      </div>
    </AppShell>
  );
}

/* ============================================================
   GAME 1: VERSE BY VERSE (existing, adapted)
   ============================================================ */
const DIFFICULTIES = {
  easy: { label: "Easy", desc: "Fill in a few blanks", ratio: 0.25 },
  medium: { label: "Medium", desc: "Fill in many blanks", ratio: 0.5 },
  hard: { label: "Hard", desc: "Unscramble the entire verse", ratio: 1.0 },
};

const FILTERS = {
  all: { label: "All Scripture", icon: "\u{1F4D6}" },
  OT: { label: "Old Testament (LXX)", icon: "\u{1F4DC}" },
  NT: { label: "New Testament (NKJV)", icon: "\u271D" },
};

function generatePuzzle(verse, difficulty) {
  const words = verse.text.split(" ");
  const ratio = DIFFICULTIES[difficulty].ratio;
  const count = Math.max(1, Math.round(words.length * ratio));
  let blankIndices;
  if (difficulty === "hard") {
    blankIndices = words.map((_, i) => i);
  } else {
    const indices = words.map((_, i) => i);
    blankIndices = shuffle(indices).slice(0, count).sort((a, b) => a - b);
  }
  const blankedWords = blankIndices.map((i) => words[i]);
  const displayWords = words.map((w, i) =>
    blankIndices.includes(i) ? { type: "blank", index: i, answer: w } : { type: "given", word: w }
  );
  return { verse, displayWords, dragWords: shuffle(blankedWords), blankIndices, placed: {}, totalBlanks: blankIndices.length };
}

function WordBank({ words, onDragStart, placed, onTap, selectedIndex }) {
  const available = words.filter((_, i) => !placed[i]);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", minHeight: 56, padding: "16px 12px", background: "rgba(139,90,43,0.06)", borderRadius: 16, border: "2px dashed rgba(139,90,43,0.2)" }}>
      {available.length === 0 && <span style={{ color: "rgba(139,90,43,0.4)", fontStyle: "italic", fontFamily: "'EB Garamond', serif", fontSize: 17 }}>All words placed!</span>}
      {words.map((word, i) => {
        const isSelected = selectedIndex === i;
        return (
        <div key={`bank-${i}`} draggable={!placed[i]}
          onDragStart={(e) => { e.dataTransfer.setData("text/plain", JSON.stringify({ word, bankIndex: i })); onDragStart(i); }}
          onClick={() => onTap(i)}
          style={{ display: placed[i] ? "none" : "inline-flex", padding: "8px 18px", borderRadius: 10, background: isSelected ? "linear-gradient(135deg, #8b6930, #6a4f20)" : "linear-gradient(135deg, #f5e6c8 0%, #edd9b5 100%)", border: isSelected ? "2px solid #3e2409" : "1.5px solid rgba(139,90,43,0.35)", fontFamily: "'EB Garamond', serif", fontSize: 18, fontWeight: 500, color: isSelected ? "#fdf6e3" : "#5a3a1a", cursor: "pointer", userSelect: "none", boxShadow: isSelected ? "0 4px 16px rgba(139,90,43,0.35)" : "0 2px 8px rgba(139,90,43,0.12)", transition: "all 0.15s", transform: isSelected ? "scale(1.08)" : "none" }}
        >{word}</div>
        );
      })}
    </div>
  );
}

function VerseDisplay({ puzzle, onDrop, onRemove, wrongSlot, correctSlots, onTapSlot, hasSelection }) {
  const [hoveredSlot, setHoveredSlot] = useState(null);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 8px", alignItems: "center", lineHeight: 2.4, padding: "20px 8px", justifyContent: "center" }}>
      {puzzle.displayWords.map((w, i) => {
        if (w.type === "given") return <span key={i} style={{ fontFamily: "'EB Garamond', serif", fontSize: 20, color: "#4a2e10" }}>{w.word}</span>;
        const placedWord = puzzle.placed[w.index];
        const isCorrect = correctSlots.has(w.index);
        const isWrong = wrongSlot === w.index;
        const isHovered = hoveredSlot === w.index;
        const isReady = hasSelection && !placedWord && !isCorrect;
        return (
          <span key={i}
            onDragOver={(e) => { e.preventDefault(); setHoveredSlot(w.index); }}
            onDragLeave={() => setHoveredSlot(null)}
            onDrop={(e) => { e.preventDefault(); setHoveredSlot(null); try { const data = JSON.parse(e.dataTransfer.getData("text/plain")); onDrop(w.index, data); } catch {} }}
            onClick={() => onTapSlot(w.index)}
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              minWidth: Math.max(60, w.answer.length * 11), height: 40, borderRadius: 10, padding: "4px 14px",
              fontFamily: "'EB Garamond', serif", fontSize: 19, fontWeight: 500,
              transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
              cursor: (isReady || (placedWord && !isCorrect)) ? "pointer" : "default",
              ...(isCorrect ? { background: "linear-gradient(135deg, #d4edda 0%, #b8dfca 100%)", border: "2px solid #6aae7a", color: "#2d6a3f", boxShadow: "0 2px 10px rgba(106,174,122,0.25)" }
                : isWrong ? { background: "linear-gradient(135deg, #f8d7da 0%, #f1aeb5 100%)", border: "2px solid #dc7a84", color: "#842029", animation: "shake 0.4s ease-in-out" }
                : placedWord ? { background: "linear-gradient(135deg, #f5e6c8 0%, #edd9b5 100%)", border: "2px solid rgba(139,90,43,0.4)", color: "#5a3a1a", boxShadow: "0 2px 8px rgba(139,90,43,0.15)" }
                : { background: (isHovered || isReady) ? "rgba(139,90,43,0.15)" : "rgba(139,90,43,0.05)", border: `2px ${(isHovered || isReady) ? "solid" : "dashed"} rgba(139,90,43,${(isHovered || isReady) ? 0.5 : 0.25})`, color: "transparent", animation: isReady ? "pulse 1.5s ease-in-out infinite" : "none" }),
            }}
          >{placedWord || "\u00A0"}</span>
        );
      })}
    </div>
  );
}

function VerseByVerseGame({ onBack }) {
  const [screen, setScreen] = useState("menu");
  const [difficulty, setDifficulty] = useState("easy");
  const [filter, setFilter] = useState("all");
  const [puzzle, setPuzzle] = useState(null);
  const [bankPlaced, setBankPlaced] = useState({});
  const [wrongSlot, setWrongSlot] = useState(null);
  const [correctSlots, setCorrectSlots] = useState(new Set());
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [verseIndex, setVerseIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [usedVerses, setUsedVerses] = useState([]);
  const [verseCount, setVerseCount] = useState(15);
  const [showHint, setShowHint] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);

  const getFilteredVerses = (f) => f === "OT" ? OT_VERSES : f === "NT" ? NT_VERSES : ALL_VERSES;

  const startGame = (diff) => {
    setDifficulty(diff);
    const pool = getFilteredVerses(filter);
    const shuffled = shuffle(pool).slice(0, Math.min(verseCount, pool.length));
    setUsedVerses(shuffled); setVerseIndex(0); setScore({ correct: 0, total: 0 }); setStreak(0);
    loadVerse(shuffled[0], diff); setScreen("play");
  };

  const loadVerse = (verse, diff) => {
    const p = generatePuzzle(verse, diff || difficulty);
    setPuzzle(p); setBankPlaced({}); setCorrectSlots(new Set()); setWrongSlot(null); setCompleted(false); setShowHint(false); setSelectedBank(null);
  };

  const handleDrop = (slotIndex, data) => {
    if (!puzzle || correctSlots.has(slotIndex) || puzzle.placed[slotIndex]) return;
    const blank = puzzle.displayWords.find((w) => w.type === "blank" && w.index === slotIndex);
    if (!blank) return;
    const isCorrect = data.word === blank.answer;
    const newPlaced = { ...puzzle.placed, [slotIndex]: data.word };
    const newBankPlaced = { ...bankPlaced, [data.bankIndex]: true };
    setPuzzle({ ...puzzle, placed: newPlaced }); setBankPlaced(newBankPlaced);
    if (isCorrect) {
      const nc = new Set(correctSlots); nc.add(slotIndex); setCorrectSlots(nc);
      setScore(s => ({ correct: s.correct + 1, total: s.total + 1 })); setStreak(s => s + 1);
      if (nc.size === puzzle.totalBlanks) setTimeout(() => setCompleted(true), 500);
    } else {
      setWrongSlot(slotIndex); setScore(s => ({ ...s, total: s.total + 1 })); setStreak(0);
      setTimeout(() => { setWrongSlot(null); setPuzzle(p => { const r = { ...p.placed }; delete r[slotIndex]; return { ...p, placed: r }; }); setBankPlaced(bp => { const r = { ...bp }; delete r[data.bankIndex]; return r; }); }, 600);
    }
  };

  const handleRemove = (slotIndex) => {
    if (correctSlots.has(slotIndex)) return;
    const word = puzzle.placed[slotIndex]; if (!word) return;
    const bankIdx = puzzle.dragWords.findIndex((w, i) => w === word && bankPlaced[i]);
    setPuzzle(p => { const r = { ...p.placed }; delete r[slotIndex]; return { ...p, placed: r }; });
    if (bankIdx !== -1) setBankPlaced(bp => { const r = { ...bp }; delete r[bankIdx]; return r; });
    setSelectedBank(null);
  };

  const handleTapBank = (bankIndex) => { if (bankPlaced[bankIndex]) return; setSelectedBank(selectedBank === bankIndex ? null : bankIndex); };

  const handleTapSlot = (slotIndex) => {
    if (!puzzle) return;
    const placedWord = puzzle.placed[slotIndex];
    if (placedWord && !correctSlots.has(slotIndex)) { handleRemove(slotIndex); return; }
    if (selectedBank === null || selectedBank === undefined) return;
    if (correctSlots.has(slotIndex) || puzzle.placed[slotIndex]) return;
    handleDrop(slotIndex, { word: puzzle.dragWords[selectedBank], bankIndex: selectedBank }); setSelectedBank(null);
  };

  const nextVerse = () => {
    const next = verseIndex + 1;
    if (next < usedVerses.length) { setVerseIndex(next); loadVerse(usedVerses[next], difficulty); }
    else setScreen("results");
  };

  const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <AppShell>
      {screen === "menu" && (
        <div style={{ maxWidth: 540, width: "100%", padding: "24px 24px", animation: "fadeInUp 0.6s ease-out" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <BackButton onClick={onBack} />
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: 14, fontWeight: 600, color: "#3e2409", letterSpacing: 2 }}>VERSE BY VERSE</span>
            <div style={{ width: 60 }} />
          </div>

          <div style={{ marginBottom: 20, textAlign: "center" }}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, fontWeight: 600, color: "#a08050", letterSpacing: 2, marginBottom: 10, textTransform: "uppercase" }}>Select Testament</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              {Object.entries(FILTERS).map(([key, val]) => (
                <button key={key} onClick={() => setFilter(key)} style={{ padding: "10px 18px", borderRadius: 12, border: "none", cursor: "pointer", background: filter === key ? "linear-gradient(135deg, #8b6930, #6a4f20)" : "rgba(139,90,43,0.08)", color: filter === key ? "#fdf6e3" : "#8b6930", fontFamily: "'EB Garamond', serif", fontSize: 15, fontWeight: 500, transition: "all 0.2s", boxShadow: filter === key ? "0 3px 12px rgba(139,90,43,0.25)" : "none" }}>
                  {val.icon} {val.label}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 13, color: "#a08050", marginTop: 8 }}>{filter === "all" ? `${ALL_VERSES.length} verses` : filter === "OT" ? `${OT_VERSES.length} verses (LXX)` : `${NT_VERSES.length} verses (NKJV)`}</div>
          </div>

          <div style={{ marginBottom: 24, textAlign: "center" }}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, fontWeight: 600, color: "#a08050", letterSpacing: 2, marginBottom: 10, textTransform: "uppercase" }}>Verses per session</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              {[5, 10, 15, 25, 50].map(n => (
                <button key={n} onClick={() => setVerseCount(n)} style={{ width: 44, height: 44, borderRadius: 12, border: "none", cursor: "pointer", background: verseCount === n ? "linear-gradient(135deg, #8b6930, #6a4f20)" : "rgba(139,90,43,0.08)", color: verseCount === n ? "#fdf6e3" : "#8b6930", fontFamily: "'Cinzel', serif", fontSize: 16, fontWeight: 600, transition: "all 0.2s", boxShadow: verseCount === n ? "0 3px 12px rgba(139,90,43,0.25)" : "none" }}>{n}</button>
              ))}
            </div>
          </div>

          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, fontWeight: 600, color: "#a08050", letterSpacing: 2, marginBottom: 10, textTransform: "uppercase", textAlign: "center" }}>Choose Difficulty</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Object.entries(DIFFICULTIES).map(([key, val]) => (
              <button key={key} onClick={() => startGame(key)} style={{ padding: "18px 24px", borderRadius: 16, border: "none", cursor: "pointer", background: key === "easy" ? "linear-gradient(135deg, #d4edda, #b8dfca)" : key === "medium" ? "linear-gradient(135deg, #f5e6c8, #edd9b5)" : "linear-gradient(135deg, #f0d0b0, #e0b890)", boxShadow: "0 4px 20px rgba(139,90,43,0.12)", transition: "transform 0.2s, box-shadow 0.2s", textAlign: "left" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(139,90,43,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(139,90,43,0.12)"; }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 17, fontWeight: 600, color: "#3e2409", marginBottom: 2 }}>{val.label}</div>
                <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, color: "#8b6930" }}>{val.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {screen === "play" && puzzle && (
        <div style={{ maxWidth: 660, width: "100%", padding: "20px 20px", animation: "fadeInUp 0.5s ease-out" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <button onClick={() => setScreen("menu")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'EB Garamond', serif", fontSize: 16, color: "#8b6930", padding: "6px 12px", borderRadius: 8 }}>← Menu</button>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 12, color: "#a08050", background: "rgba(139,90,43,0.08)", padding: "4px 10px", borderRadius: 8 }}>{puzzle.verse.testament === "OT" ? "LXX" : "NKJV"}</span>
              <span style={{ fontFamily: "'Cinzel', serif", fontSize: 12, fontWeight: 600, color: "#8b6930", letterSpacing: 1 }}>{DIFFICULTIES[difficulty].label}</span>
            </div>
            <span style={{ fontFamily: "'EB Garamond', serif", fontSize: 15, color: "#8b6930" }}>{verseIndex + 1}/{usedVerses.length}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 28, marginBottom: 20, padding: "8px 0", borderTop: "1px solid rgba(139,90,43,0.12)", borderBottom: "1px solid rgba(139,90,43,0.12)" }}>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 20, fontWeight: 600, color: "#3e2409" }}>{accuracy}%</div><div style={{ fontSize: 11, color: "#a08050" }}>Accuracy</div></div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 20, fontWeight: 600, color: streak >= 3 ? "#6aae7a" : "#3e2409" }}>{streak}{streak >= 3 ? " 🔥" : ""}</div><div style={{ fontSize: 11, color: "#a08050" }}>Streak</div></div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 20, fontWeight: 600, color: "#3e2409" }}>{correctSlots.size}/{puzzle.totalBlanks}</div><div style={{ fontSize: 11, color: "#a08050" }}>Placed</div></div>
          </div>
          <div style={{ textAlign: "center", marginBottom: 12, fontFamily: "'Cinzel', serif", fontSize: 19, fontWeight: 600, color: "#5a3a1a", letterSpacing: 1 }}>{puzzle.verse.ref}</div>
          <div style={{ background: "rgba(255,255,255,0.5)", borderRadius: 20, padding: "12px 16px", marginBottom: 20, border: "1px solid rgba(139,90,43,0.1)", boxShadow: "0 4px 24px rgba(139,90,43,0.06)", animation: completed ? "glow 1.5s ease-in-out infinite" : "none" }}>
            <VerseDisplay puzzle={puzzle} onDrop={handleDrop} onRemove={handleRemove} wrongSlot={wrongSlot} correctSlots={correctSlots} onTapSlot={handleTapSlot} hasSelection={selectedBank !== null} />
          </div>
          {!completed && showHint && <div style={{ textAlign: "center", marginBottom: 16, padding: "12px 16px", background: "rgba(106,174,122,0.08)", borderRadius: 12, border: "1px solid rgba(106,174,122,0.2)", fontFamily: "'EB Garamond', serif", fontSize: 16, color: "#2d6a3f", fontStyle: "italic", lineHeight: 1.6 }}>{puzzle.verse.text}</div>}
          {completed && (
            <div style={{ textAlign: "center", padding: "20px 16px", marginBottom: 16, background: "linear-gradient(135deg, rgba(106,174,122,0.12), rgba(106,174,122,0.05))", borderRadius: 20, border: "2px solid rgba(106,174,122,0.3)", animation: "celebrateIn 0.5s ease-out" }}>
              <div style={{ fontSize: 32, marginBottom: 6 }}>✨</div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 20, fontWeight: 600, color: "#2d6a3f", marginBottom: 12 }}>Verse Complete!</div>
              <button onClick={nextVerse} style={{ padding: "12px 32px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #6aae7a, #4d9060)", color: "#fff", fontFamily: "'Cinzel', serif", fontSize: 15, fontWeight: 600, cursor: "pointer", letterSpacing: 1, boxShadow: "0 4px 16px rgba(106,174,122,0.3)" }}>
                {verseIndex + 1 < usedVerses.length ? "NEXT VERSE →" : "VIEW RESULTS"}
              </button>
            </div>
          )}
          {!completed && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, padding: "0 4px" }}>
                <button onClick={() => setShowHint(!showHint)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'EB Garamond', serif", fontSize: 14, color: "#a08050", padding: "4px 8px", borderRadius: 6, textDecoration: "underline", textDecorationStyle: "dotted" }}>{showHint ? "Hide Hint" : "Show Hint"}</button>
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: 11, fontWeight: 600, color: "#a08050", letterSpacing: 2, textTransform: "uppercase" }}>Tap a word, then tap a blank</span>
                <button onClick={nextVerse} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'EB Garamond', serif", fontSize: 14, color: "#a08050", padding: "4px 8px", borderRadius: 6, textDecoration: "underline", textDecorationStyle: "dotted" }}>Skip →</button>
              </div>
              <WordBank words={puzzle.dragWords} onDragStart={() => {}} placed={bankPlaced} onTap={handleTapBank} selectedIndex={selectedBank} />
            </div>
          )}
        </div>
      )}

      {screen === "results" && (
        <div style={{ maxWidth: 480, width: "100%", padding: "40px 24px", textAlign: "center", animation: "fadeInUp 0.6s ease-out" }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>{accuracy >= 90 ? "🏆" : accuracy >= 70 ? "⭐" : "📖"}</div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 26, fontWeight: 700, color: "#3e2409", margin: "0 0 6px" }}>Session Complete</h2>
          <p style={{ fontSize: 16, color: "#8b6930", marginBottom: 28 }}>{DIFFICULTIES[difficulty].label} Mode · {filter === "all" ? "All Scripture" : filter === "OT" ? "OT (LXX)" : "NT (NKJV)"}</p>
          <div style={{ background: "rgba(255,255,255,0.5)", borderRadius: 20, padding: "24px 20px", marginBottom: 28, border: "1px solid rgba(139,90,43,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 36 }}>
              <div><div style={{ fontSize: 36, fontWeight: 700, color: "#3e2409" }}>{accuracy}%</div><div style={{ fontSize: 13, color: "#a08050" }}>Accuracy</div></div>
              <div><div style={{ fontSize: 36, fontWeight: 700, color: "#3e2409" }}>{score.correct}</div><div style={{ fontSize: 13, color: "#a08050" }}>Correct</div></div>
              <div><div style={{ fontSize: 36, fontWeight: 700, color: "#3e2409" }}>{usedVerses.length}</div><div style={{ fontSize: 13, color: "#a08050" }}>Verses</div></div>
            </div>
          </div>
          <button onClick={onBack} style={{ padding: "14px 36px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #8b6930, #6a4f20)", color: "#fdf6e3", fontFamily: "'Cinzel', serif", fontSize: 15, fontWeight: 600, cursor: "pointer", letterSpacing: 1.5, boxShadow: "0 4px 20px rgba(139,90,43,0.25)" }}>BACK TO MENU</button>
        </div>
      )}
    </AppShell>
  );
}

/* ============================================================
/* ============================================================
   MAIN APP - ROUTER
   ============================================================ */
export default function App() {
  const [currentGame, setCurrentGame] = useState("home");

  const goHome = () => setCurrentGame("home");

  switch (currentGame) {
    case "verses": return <VerseByVerseGame onBack={goHome} />;
    case "whosaid": return <WhoSaidItGame onBack={goHome} />;
    case "saints": return <GuessTheSaintGame onBack={goHome} />;
    case "trivia": return <BibleTriviaGame onBack={goHome} />;
    default: return <HomeScreen onSelectGame={setCurrentGame} />;
  }
}
