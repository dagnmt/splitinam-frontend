const COLORS = ["#FF6B35","#1A936F","#004E89","#C84B31","#EC9A29","#7B2D8B","#2196F3","#E91E63"];

export default function avatarColor(name) {
  return COLORS[name.charCodeAt(0) % COLORS.length];
}