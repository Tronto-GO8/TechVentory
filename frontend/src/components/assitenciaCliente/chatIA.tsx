import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
};

type ChatIaProps = {
  preMessages: string[];
  setPreMessages: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function ChatIa({ preMessages, setPreMessages }: ChatIaProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatStarted, setChatStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Rolagem automática
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Receber mensagens externas da barra lateral
  useEffect(() => {
    if (preMessages.length > 0) {
      const newMessages: Message[] = preMessages.map((text) => ({
        id: Date.now() + Math.random(), // ID único
        sender: "user",
        text,
      }));
      setMessages((prev) => [...prev, ...newMessages]);
      setPreMessages([]); // limpa as mensagens do pai
      setChatStarted(true);
      simulateBotResponse();
    }
  }, [preMessages, setPreMessages]);

  // Envio manual
  const handleSend = () => {
    if (!inputText.trim()) return;
    setChatStarted(true);

    const newMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: inputText.trim(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
    simulateBotResponse();
  };

  // Resposta automática do bot
  const simulateBotResponse = () => {
    setIsLoading(true);
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: "Essa é uma resposta automática da IA",
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex justify-end">
      <div className="m-4 mr-10 lg:mt-9 w-full max-w-[95vw] lg:mr-28 sm:max-w-[85vw] md:max-w-[90vw] lg:max-w-[55vw] h-[85vh] overflow-hidden flex flex-col border rounded-lg shadow-lg bg-white dark:bg-gray-900 dark:border-white">
        {/* Área de mensagens */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-2">
          {!chatStarted ? (
            <div className="flex h-full items-center justify-center text-gray-500 text-xl">
              <p>Digite algo para começarmos...</p>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] p-2 rounded-lg whitespace-normal break-words ${
                      msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input fixo embaixo */}
        <div className="p-4 border-t flex items-center gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Digite sua mensagem..."
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            size="icon"
            variant="default"
            aria-label="Enviar mensagem"
            disabled={isLoading}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
