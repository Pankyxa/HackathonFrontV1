import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Добавляем перехватчик для токена
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const filesApi = {
    async downloadStaticFile(filePath) {
        try {
            const response = await api.get(`/files/static/${filePath}`, {
                responseType: 'blob',
            });

            // Получаем имя файла из заголовка Content-Disposition или используем путь
            let filename = filePath.split('/').pop();
            const contentDisposition = response.headers['content-disposition'];
            if (contentDisposition) {
                // Пытаемся найти filename*=UTF-8'' (RFC 5987)
                const rfc5987Match = contentDisposition.match(/filename\*=UTF-8''(.+?)(?:;|$)/);
                if (rfc5987Match) {
                    filename = decodeURIComponent(rfc5987Match[1]);
                } else {
                    // Иначе ищем обычный filename="..."
                    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                    if (filenameMatch && filenameMatch[1]) {
                        filename = filenameMatch[1].replace(/['"]/g, '');
                    }
                }
            }

            const url = window.URL.createObjectURL(new Blob([response.data], {
                type: response.headers['content-type'] || 'application/pdf'
            }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
            throw error;
        }
    }
};
