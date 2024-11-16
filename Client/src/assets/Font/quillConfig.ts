// src/config/quillConfig.ts
export const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }], // Định dạng tiêu đề
      ['bold', 'italic', 'underline', 'strike'], // Định dạng chữ
      [{ list: 'ordered' }, { list: 'bullet' }], // Danh sách
      ['link', 'image'], // Liên kết và hình ảnh
      ['clean'], // Xóa định dạng
    ],
  };
  
  export const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image',
  ];
  // src/utils/stringUtils.ts
export const stripHtml = (html: string): string => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    return tempElement.textContent || '';
  };
  