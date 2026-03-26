import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Menu, 
  X, 
  ChevronRight, 
  MousePointer2, 
  Activity,
  Navigation,
  Cpu,
  Layers
} from "lucide-react";

const THEME = {
  primary: "#00f2ff",
  secondary: "#0066ff",
  bg: "#050505",
  text: "#ffffff",
  muted: "rgba(255, 255, 255, 0.4)"
};

function HUD() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex flex-col justify-between p-6 md:p-10 font-sans">
      {/* Top Bar */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-white flex items-center justify-center rounded-sm shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <span className="text-black font-black italic text-2xl tracking-tighter">X</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-[0.5em] uppercase leading-none mb-1">XPENG</span>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-white/40 tracking-[0.3em] uppercase font-medium">数字艺术装置</span>
              <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6 text-[10px] uppercase tracking-[0.4em] font-bold text-white/40">
          </div>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-full transition-all duration-500 group"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 group-hover:scale-110" />}
          </button>
        </div>
      </div>

      {/* Side Micro-Labels */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col gap-12">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-6 group cursor-pointer pointer-events-auto">
            <div className="flex flex-col items-center gap-2">
              <span className="text-[9px] font-mono text-white/20 group-hover:text-cyan-400 transition-colors">0{i}</span>
              <div className="w-[1px] h-8 bg-white/10 group-hover:bg-cyan-400/50 transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 text-[10px] text-cyan-400 font-bold tracking-[0.4em] uppercase">
            <Activity className="w-3.5 h-3.5" />
            <span className="animate-pulse">神经网络连接已激活</span>
          </div>
          <div className="flex gap-8">
            <div className="flex flex-col">
              <span className="text-[8px] text-white/20 uppercase tracking-widest mb-1">位置</span>
              <span className="text-[10px] font-mono text-white/60 tracking-wider uppercase">中国, 广州</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] text-white/20 uppercase tracking-widest mb-1">状态</span>
              <span className="text-[10px] font-mono text-white/60 tracking-wider uppercase">沉浸模式</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-12 pointer-events-auto">
          <div className="flex flex-col items-end gap-2">
            <span className="text-[9px] text-white/30 uppercase tracking-[0.5em] font-bold">滚动探索</span>
            <div className="w-32 h-[1px] bg-white/5 relative overflow-hidden">
              <motion.div 
                animate={{ x: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 pointer-events-auto flex items-center justify-center z-[60]"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 p-12 max-w-6xl w-full">
              <div className="flex flex-col gap-12">
                {["智能感知", "卓越性能", "沉浸体验"].map((item, i) => (
                  <motion.a
                    key={item}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    href="#"
                    className="text-6xl md:text-8xl font-black uppercase tracking-tighter hover:text-cyan-400 transition-all duration-500 hover:translate-x-4"
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
              <div className="hidden md:flex flex-col justify-center gap-8 border-l border-white/10 pl-24">
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-cyan-400 font-bold tracking-[0.4em] uppercase">联系我们</span>
                  <p className="text-white/40 text-sm leading-relaxed">
                    press@xpeng.com<br />
                    investor@xpeng.com
                  </p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-10 right-10 w-16 h-16 flex items-center justify-center hover:bg-white/10 rounded-full transition-all"
            >
              <X className="w-8 h-8" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SectionContent({ title, subtitle, description, index }: { title: string, subtitle: string, description: string, index: number }) {
  return (
    <div className="h-screen flex flex-col justify-center px-12 md:px-48 max-w-6xl font-sans">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "-20%" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-4 mb-8">
          <span className="text-cyan-400 text-xs font-black tracking-[0.6em] uppercase">
            章节 0{index}
          </span>
          <div className="w-12 h-[1px] bg-cyan-400/30" />
          <span className="text-white/30 text-[10px] font-bold tracking-[0.4em] uppercase">
            {subtitle}
          </span>
        </div>
        
        <h2 
          className="text-7xl md:text-[10rem] font-black tracking-tighter uppercase mb-12 leading-[0.85] text-white"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
          <p className="text-lg md:text-xl text-white/40 font-light leading-relaxed tracking-wide">
            {description}
          </p>
          <div className="flex flex-col gap-10">
            <div className="flex gap-12">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-white/20 uppercase tracking-widest">性能指标</span>
                <span className="text-xl font-mono text-cyan-400">99.9%</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-white/20 uppercase tracking-widest">响应延迟</span>
                <span className="text-xl font-mono text-cyan-400">2ms</span>
              </div>
            </div>
            <button className="group w-fit flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.5em] text-white/60 hover:text-cyan-400 transition-all duration-500">
              <span className="border-b border-white/20 group-hover:border-cyan-400 pb-1">探索核心技术</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-3 transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full">
      <HUD />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export { SectionContent };
