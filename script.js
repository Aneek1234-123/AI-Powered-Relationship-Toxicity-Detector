const instructions = `You are Toximate, a highly empathetic and emotionally intelligent relationship wellness       assistant.
                Your mission is to help users understand and navigate the emotional and psychological aspects of their relationships. You act like a compassionate friend and a wise therapist. You never use harsh or insensitive language. You are gentle, caring, supportive, and always prioritize the user’s mental and emotional well-being. You are also tasked to suggest some kind of exercise, yoga, or any kind of music to overcome their mental disturbances. You are also tasked to motivate users.

                Your Responsibilities:

                1. **Emotion Understanding**:
                - Detect and respond to the user’s emotional tone with deep empathy.
                - Acknowledge their feelings and validate their experiences.
                - Use soft and reassuring language that shows care and concern.

                2. **Problem Identification**:
                - Ask users about their current relationship situation.
                - Listen patiently and respond non-judgmentally.
                 -Try to find the main problem of users.
                - Encourage them to open up, and recognize patterns of emotional struggle.

                3. **Toxicity & Abuse Detection**:
                - Detect signs of toxic behavior (e.g., gaslighting, manipulation, control, verbal/emotional/physical abuse).
                - Inform the user gently but clearly about what is toxic or unacceptable.
                - Explain healthy vs. unhealthy behaviors in relationships.

                4. **Supportive Solutions**:
                - Provide calming, helpful, and emotionally intelligent advice like some calming lo-fi, soft piano, or nature sounds music, some motivational quotes, some Meditation excerice.
                - Suggest boundaries, communication tips, and healthy coping mechanisms.
                - If serious abuse is suspected, recommend contacting professional help or authorities.
                - Never make the user feel ashamed, helpless or wrong.

                5. **Tone & Language**:
                - Always warm, supportive, non-judgmental, guide, and understanding.
                - Use phrases like: 
                    - “You are not alone.” 
                    - “I hear you.” 
                    - “It’s okay to feel this way.” 
                    - “You deserve to be safe and respected.”
                   -“You can Share me your feelings .”
                  -“Even the darkest night will end and the sun will rise.”
                 -“You are allowed to outgrow people who don’t grow with you”
                - You are here to empower, not diagnose or scold.

                **Strict Limitation**:
                You are ONLY allowed to respond to conversations related to:
                - Relationship issues
                - Toxic behaviors
                - Emotional abuse
                - Healing, support, and mental well-being in the context of relationships
                - Remeber their name always 
                - keep the response  within 30 words depending upon the user’s input you can extend the response 
                - keep the response concise.
          

                If the user asks something outside of this domain (like math, news, programming, random trivia, or technical queries), politely reply:
                "I'm here to help with emotional support and relationship-related concerns. I don’t have information about that topic."

                Under no circumstances should you attempt to answer questions outside of emotional wellness and relationship topics.`

//////// uptil now this was the prompt to configure the model

const API_KEY = "AIzaSyD9_NfpyGeNIHlWH284qR-IC4ygszxmdJ0"; // api key used for gemini api 
const MODEL_NAME = "gemini-2.5-flash"; // name of model used for gemini
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;  // url to use the gemini api , from here only data is fetched and used

        var conversation_history = [] // the conversation history is stored here , the user's input + ai output everything
async function sendMessage() {
    const userMessage = document.querySelector(".chat-input-box input").value //targets the input by the user
    if (userMessage.length) { // if the user does not types anything and press send button it still works that's why a condition is placed such that if the user input which is astring has length greater than 0 it will  work then only
        document.querySelector(".chat-input-box input").value = ""  // to clear the input box after user presses send
        document.querySelector(".chat-section").insertAdjacentHTML("beforeend", `
             <div class="user-chat-box">
                <div class="user-chat-container"><p>${userMessage}</p></div>
                <img src="user-chat.svg" height="100%" alt="">
            </div>
            `)// inserting the input given by the user into the chatbot box of the user , box having female photo or user photo. Here we user beforeend bcoz we want to insert just before end of chat-section
        document.querySelector(".chat-section").insertAdjacentHTML("beforeend", `
             <div class="loader"></div>
            `)/// loader added after user inputs 
        document.querySelector(".send-btn").innerHTML=`<img src="wait.svg" alt="send" >`;// pause button 
        conversation_history.push({
            role: "user",
            parts: [{ text: userMessage }] // the user message is pushed into the conversation history
        })
        const data = {   // this part is used to create the input that will be given to  the ai model , the ai model will generate output according to this
            contents: conversation_history,    // the entire conversation history is given as input to the ai model , this means all the previous conversations are given as input 
            systemInstruction: {
                parts: [{ text: instructions }]  // the prompt saved earlier is feeded here as system instructions so that the user cannot change the input , otherwise the user can modify the chatbot according to themselves 
            }
        };

        try {
            const response = await fetch(API_URL, {  // api fetch is done here to get response from gemini model
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify(data)// as i said the input os given to the ai model
            });

            if (!response.ok) { // if no response is generated this will throw an error
                const errorData = await response.json();
                throw new Error(`API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
            }
            const result = await response.json(); // this waits for the response and will only move further in the code when the response is generated
            const ai_response_output = result.candidates[0].content.parts[0].text // the the response generated is an object this line gets the real output that is required  

            const loader = document.querySelector(".loader");   //this removes the loader  before ai bot ouput is shown
            if (loader) {
                loader.remove()
            };
             document.querySelector(".send-btn").innerHTML=`<img src="send.svg" alt="send" >`; // send button


            document.querySelector(".chat-section").insertAdjacentHTML("beforeend", `
              <div class="bot-chat-box">
                <img src="bot-chat-.svg" height="100%" alt="">
                <div class="bot-chat-container">
                    <p></p>
                </div>
            </div>`) // this adds a new boxx that contains the ai ouput and we can see this as bot ouput
            for await (i of ai_response_output) {
                let text = document.querySelector(".chat-section").querySelectorAll(".bot-chat-box");
                text[text.length - 1].querySelector("p").insertAdjacentText("beforeend", `${i}`)
            } // this add each text one by one in the output box
            conversation_history.push({
                role: "model",
                parts: [{ text: ai_response_output }] // the generated response is pushed into conversation history
            })
        } catch (error) { /// if any error occurs it is caught here 
            const loader = document.querySelector(".loader"); // loader removed 
            if (loader) {
                loader.remove()
            };
            document.querySelector(".chat-section").insertAdjacentHTML("beforeend", `
                <div class="error-box">
                    <p>sorry the message could not be sent due to this reason , Please try again later</p>
                </div>`)// this error message is shown in screen

        }
    }

}
document.querySelector(".chat-input button").addEventListener("click", () => {
    sendMessage()
})
document.querySelector(".chat-input input").addEventListener("keypress", (event) => {
    if(event.keyCode===13){ /// checks if both values are equal in value and type
        event.preventDefault();// prevents the default function of enter button which is submit the form and reload the page , it prevents this 
        sendMessage();
    }
})

