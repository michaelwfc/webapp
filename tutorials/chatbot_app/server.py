import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
from pydantic import BaseModel
from openai import OpenAI


DASHSCOPE_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1"

QWEN3_MAX = "qwen3-max"
QWEN_PLUS = "qwen-plus"
QWEN_FLASH = "qwen-flash"


app = FastAPI()


def init_qwen_with_openai(
    dashscope_base_url=DASHSCOPE_BASE_URL,
) -> OpenAI:
    load_dotenv()
    dashscope_api_key = os.getenv("DASHSCOPE_API_KEY")

    # 初始化客户端
    qwen_client = OpenAI(
        api_key=dashscope_api_key,
        base_url=dashscope_base_url,
    )
    return qwen_client


client = init_qwen_with_openai()


def call_qwen_with_openai_client(
    prompt: str = "who are you?",
    response_format: BaseModel = None,
    model_name=QWEN_FLASH,
    temperature=0,
):
    try:
        client = init_qwen_with_openai()
        response = client.chat.completions.create(
            model=model_name,
            temperature=temperature,
            messages=[{"role": "user", "content": prompt}],
        )
        response_content = response.choices[0].message.content

        return response_content

    except Exception as e:
        print(f"error: {e}")
        raise e


class ChatRequest(BaseModel):
    message: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/chat")
def chat(req: ChatRequest):
    def token_generator():
        # Open a streaming request to Claude
        # with client.messages.stream(
        #     model="claude-opus-4-5",
        #     max_tokens=1024,
        #     messages=[{"role": "user", "content": req.message}],
        # ) as stream:
        #     for text in stream.text_stream:
        #         yield text  # yield each token as it arrives

        # ✅ CORRECT — use OpenAI-compatible streaming syntax to match your client
        stream = client.chat.completions.create(
            model=QWEN_FLASH,
            messages=[{"role": "user", "content": req.message}],
            stream=True,  # ← enables streaming
        )
        for chunk in stream:
            delta = chunk.choices[0].delta.content
            if delta:
                yield delta

    # StreamingResponse sends the generator output chunk by chunk
    return StreamingResponse(token_generator(), media_type="text/plain")


# ── Static files — MUST be last, at module level ──────────────────────────────
# ✅ This runs every time uvicorn imports server.py (including on reload)
app.mount("/", StaticFiles(directory="public", html=True), name="static")


def run_app():
    """
    mounts a static file server to your FastAPI application, allowing it to serve frontend files (HTML, CSS, JavaScript, images, etc.) from a directory.
    Serve the frontend HTML/JS files
    When enabled:
    - Requesting / automatically serves public/index.html
    - Useful for Single Page Applications (SPA)

    Why This Is Used
    1. Serve Frontend - Deliver HTML/CSS/JS to browsers
    2. Single Deployment - Backend API + Frontend in one server
    3. No Separate Web Server - No need for Nginx/Apache in development

    reload=True : Development with hot reload
    String in code

    reload=False: Production or simple scripts

    """
    # Get absolute path to public folder
    current_dir = os.path.dirname(os.path.abspath(__file__))
    public_dir = os.path.join(current_dir, "public")

    # Verify folder exists
    if not os.path.exists(public_dir):
        print(f"Warning: {public_dir} does not exist!")
        os.makedirs(public_dir, exist_ok=True)
        # Create default index.html
        # with open(os.path.join(public_dir, "index.html"), "w") as f:
        #     f.write("<h1>Chatbot App</h1>")
    else:
        print(f"Serving {public_dir}")
        if os.path.exists(os.path.join(public_dir, "index.html")):
            print("Serving index.html")
        else:
            print("Warning: index.html not found!")

    # # ❌ only runs once at startup
    # When uvicorn reloads, it imports the module and uses the app object directly —
    # it never calls run_app() again, so your app.mount() line is skipped entirely.
    # app.mount("/", StaticFiles(directory="public", html=True), name="static")

    # uvicorn server:app --reload
    # ✅ Fix: Pass application as import string when reload=True
    # Development with hot reload
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)


if __name__ == "__main__":
    # prompt: str = "who are you?"
    # response_content = call_qwen_with_openai_client(prompt)
    # print(f"Calling qwen model:\ninput: {prompt}\noutput: {response_content}")
    # run_app()
    run_app()
