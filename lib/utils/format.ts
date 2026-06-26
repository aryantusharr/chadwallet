export function formatPrice(price: number | null | undefined, decimals = 2): string {
  if (price === null || price === undefined || isNaN(price)) return "$0.00";
  if (price === 0) return "$0.00";

  const absPrice = Math.abs(price);
  if (absPrice >= 0.01) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(price);
  }

  const exponent = Math.floor(Math.log10(absPrice));
  const d = Math.min(8, Math.max(2, -exponent + 2));
  const formatted = price.toFixed(d);
  
  const trimmed = formatted.replace(/(\.\d*?[1-9])0+$/, "$1").replace(/\.0+$/, ".00");
  return `$${trimmed}`;
}

export function formatTokenAmount(amount: number | null | undefined, decimals = 2): string {
  if (amount === null || amount === undefined || isNaN(amount)) return "0";
  if (amount === 0) return "0";

  const hasDecimals = amount % 1 !== 0;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: hasDecimals ? decimals : 0,
    maximumFractionDigits: decimals,
  }).format(amount);
}

export function formatPercent(percent: number | null | undefined, decimals = 2): string {
  if (percent === null || percent === undefined || isNaN(percent)) return "0.00%";
  const sign = percent > 0 ? "+" : "";
  return `${sign}${percent.toFixed(decimals)}%`;
}

export function formatAddress(address: string | null | undefined, chars = 4): string {
  if (!address) return "";
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function formatTime(timestamp: number | Date | string): string {
  if (typeof timestamp === "string") return timestamp;
  
  const ms = timestamp instanceof Date 
    ? timestamp.getTime() 
    : (timestamp > 1e11 ? timestamp : timestamp * 1000);
    
  const diff = Date.now() - ms;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
}
