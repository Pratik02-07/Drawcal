import React, { useRef, useState, useEffect } from 'react';
import { Button, ColorSwatch, TextInput, Group, Paper, Stack, ActionIcon, Tooltip, Slider, Select, Badge, Menu, Divider, Modal, Text, Switch } from '@mantine/core';

type ToolType = 'pen' | 'eraser' | 'text';

// Simple SVG icons to replace @tabler/icons-react
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const EraserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13L11 20L4 13L11 6L18 13Z"></path>
  </svg>
);

const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);

const TextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <text x="6" y="18" fontSize="16" fontWeight="bold">A</text>
  </svg>
);

const CalculatorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2"></rect>
    <line x1="8" y1="6" x2="16" y2="6"></line>
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 4v6h-6"></path>
    <path d="M1 20v-6h6"></path>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const UndoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7v6h6"></path>
    <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
  </svg>
);

const RedoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 7v6h-6"></path>
    <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"></path>
  </svg>
);

const ShapeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
  </svg>
);

const CircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
  </svg>
);

const LineIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const SelectIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3h18v18H3z"></path>
  </svg>
);

const NewPageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
  </svg>
);

const ImportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const CalculateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
  </svg>
);

const SWATCHES = [
  '#FFFFFF', // White
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#000000', // Black
  '#808080', // Gray
  '#FFA500', // Orange
  '#800080', // Purple
  '#008080', // Teal
];

const FONT_SIZES = [
  { value: '12', label: 'Small' },
  { value: '16', label: 'Medium' },
  { value: '20', label: 'Large' },
  { value: '24', label: 'Extra Large' },
  { value: '32', label: 'Huge' },
];

const FONT_FAMILIES = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Verdana', label: 'Verdana' },
];

interface CanvasProps {
  onCalculate: (imageData: string) => void;
  isLoading: boolean;
}

const Canvas: React.FC<CanvasProps> = ({ onCalculate, isLoading }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<ToolType>('pen');
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - canvas.offsetTop;
        ctx.fillStyle = '#1A1B1E';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineCap = 'round';
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#FFFFFF';
        contextRef.current = ctx;
        saveToHistory();
      }
    }
  }, []);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.putImageData(history[newIndex], 0, 0);
  };

  const redo = () => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.putImageData(history[newIndex], 0, 0);
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#1A1B1E';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveToHistory();
      }
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === 'text') return;
    
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = tool === 'eraser' ? '#1A1B1E' : '#FFFFFF';
        ctx.lineWidth = tool === 'eraser' ? 20 : 2;
        setIsDrawing(true);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || tool === 'text') return;
    
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const handleCalculate = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const imageData = canvas.toDataURL('image/png');
      onCalculate(imageData);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canvasRef.current) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const maxWidth = canvas.width * 0.8;
        const maxHeight = canvas.height * 0.8;
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          const ratio = maxWidth / width;
          width = maxWidth;
          height = height * ratio;
        }
        
        if (height > maxHeight) {
          const ratio = maxHeight / height;
          height = maxHeight;
          width = width * ratio;
        }
        
        const x = (canvas.width - width) / 2;
        const y = (canvas.height - height) / 2;
        
        ctx.drawImage(img, x, y, width, height);
        saveToHistory();
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a temporary link element
    const link = document.createElement('a');
    link.download = 'canvas-drawing.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === 'text') {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setTextPosition({ x, y });
        setShowTextInput(true);
      }
    }
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) {
      setShowTextInput(false);
      return;
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = '20px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(textInput, textPosition.x, textPosition.y);
        setTextInput('');
        setShowTextInput(false);
        saveToHistory();
      }
    }
  };

  return (
    <>
      {showTextInput && (
        <div
          style={{
            position: 'fixed',
            left: textPosition.x,
            top: textPosition.y,
            zIndex: 1000,
          }}
        >
          <TextInput
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleTextSubmit();
              } else if (e.key === 'Escape') {
                setShowTextInput(false);
                setTextInput('');
              }
            }}
            autoFocus
            placeholder="Type text and press Enter"
            style={{ width: '200px' }}
          />
        </div>
      )}

      <Paper 
        shadow="md" 
        className="fixed top-4 left-4 z-20"
        style={{ 
          background: '#25262B',
          borderRadius: '12px',
          padding: '8px'
        }}
      >
        <Stack gap="xs">
          <Group gap="xs">
            <Tooltip label="Pen">
              <ActionIcon 
                size="xl" 
                variant={tool === 'pen' ? 'filled' : 'subtle'}
                color="gray"
                onClick={() => setTool('pen')}
                radius="xl"
              >
                <PencilIcon />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Eraser">
              <ActionIcon 
                size="xl" 
                variant={tool === 'eraser' ? 'filled' : 'subtle'}
                color="gray"
                onClick={() => setTool('eraser')}
                radius="xl"
              >
                <EraserIcon />
              </ActionIcon>
            </Tooltip>
          </Group>

          <Group gap="xs">
            <Tooltip label="New Page">
              <ActionIcon 
                size="xl" 
                variant="subtle"
                color="gray"
                onClick={resetCanvas}
                radius="xl"
              >
                <NewPageIcon />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Download">
              <ActionIcon 
                size="xl" 
                variant="subtle"
                color="gray"
                onClick={handleDownload}
                radius="xl"
              >
                <DownloadIcon />
              </ActionIcon>
            </Tooltip>
          </Group>

          <Group gap="xs">
            <Tooltip label="Add Text">
              <ActionIcon 
                size="xl" 
                variant={tool === 'text' ? 'filled' : 'subtle'}
                color="gray"
                onClick={() => setTool('text')}
                radius="xl"
              >
                <TextIcon />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Add Image">
              <ActionIcon 
                size="xl" 
                variant="subtle"
                color="gray"
                onClick={() => imageInputRef.current?.click()}
                radius="xl"
              >
                <ImageIcon />
              </ActionIcon>
            </Tooltip>
            <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: 'none' }}
              aria-label="Upload image"
            />
          </Group>

          <Group gap="xs">
            <Tooltip label="Undo">
              <ActionIcon 
                size="xl" 
                variant="subtle"
                color="gray"
                onClick={undo}
                disabled={historyIndex <= 0}
                radius="xl"
              >
                <UndoIcon />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Redo">
              <ActionIcon 
                size="xl" 
                variant="subtle"
                color="gray"
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                radius="xl"
              >
                <RedoIcon />
              </ActionIcon>
            </Tooltip>
          </Group>

          <Group gap="xs">
            <Tooltip label="Delete">
              <ActionIcon 
                size="xl" 
                variant="subtle"
                color="red"
                onClick={resetCanvas}
                radius="xl"
              >
                <DeleteIcon />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Calculate">
              <ActionIcon 
                size="xl" 
                variant="subtle"
                color="blue"
                onClick={handleCalculate}
                loading={isLoading}
                radius="xl"
              >
                <CalculateIcon />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Stack>
      </Paper>

      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{ 
          background: '#1A1B1E',
          touchAction: 'none'
        }}
        onClick={handleCanvasClick}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={(e: React.TouchEvent<HTMLCanvasElement>) => {
          e.preventDefault();
          if (tool === 'text') return;
          
          const touch = e.touches[0];
          const canvas = canvasRef.current;
          if (canvas) {
            const rect = canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.strokeStyle = tool === 'eraser' ? '#1A1B1E' : '#FFFFFF';
              ctx.lineWidth = tool === 'eraser' ? 20 : 2;
              setIsDrawing(true);
            }
          }
        }}
        onTouchMove={(e: React.TouchEvent<HTMLCanvasElement>) => {
          e.preventDefault();
          if (!isDrawing || tool === 'text') return;
          
          const touch = e.touches[0];
          const canvas = canvasRef.current;
          if (canvas) {
            const rect = canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.lineTo(x, y);
              ctx.stroke();
            }
          }
        }}
        onTouchEnd={(e: React.TouchEvent<HTMLCanvasElement>) => {
          e.preventDefault();
          stopDrawing();
        }}
      />
    </>
  );
};

export default Canvas; 