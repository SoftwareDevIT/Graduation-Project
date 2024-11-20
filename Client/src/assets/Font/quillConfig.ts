
export const stripHtml = (html: string): string => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    return tempElement.textContent || '';
  };
  