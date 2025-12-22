const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://20.197.14.33:3000/api';
const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || 'your-admin-api-key';

interface ApiOptions {
    method?: string;
    body?: any;
    requiresAuth?: boolean;
}

// Exercise schema matching mobile app
export interface Exercise {
    id: string;
    name: string;
    category: 'chest' | 'back' | 'shoulders' | 'legs' | 'arms' | 'core' | 'cardio' | 'flexibility' | 'other';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    gifUrl?: string;
    defaultSets?: string;
    description?: string;
    targetMuscles?: string[];
    instructions?: string;
    equipment?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// Food schema matching mobile app
export interface Food {
    id: string;
    name: string;
    nameHindi?: string;
    category: string;
    emoji?: string;
    imageUrl?: string;
    servingSize?: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    searchTerms?: string;
    pairingTags?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface Promotion {
    id: string;
    title?: string;
    imageUrl: string;
    externalLink: string;
    delayDays: number;
    isActive: boolean;
    createdAt?: string;
}

export const api = {
    // Generic API call
    async call(endpoint: string, options: ApiOptions = {}) {
        const { method = 'GET', body, requiresAuth = false } = options;

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (requiresAuth) {
            headers['X-Admin-Key'] = ADMIN_KEY;
        }

        const config: RequestInit = {
            method,
            headers,
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

            let data;
            try {
                data = await response.json();
            } catch {
                data = {};
            }

            if (!response.ok) {
                throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
            }

            return data;
        } catch (error: any) {
            if (error.message) throw error;
            throw new Error('Network error. Please check your connection and backend status.');
        }
    },

    // Exercises
    async getExercises(category?: string, difficulty?: string, search?: string): Promise<{ success: boolean; data: Exercise[]; count?: number }> {
        let url = '/exercises';
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (difficulty) params.append('difficulty', difficulty);
        if (search) params.append('search', search);
        if (params.toString()) url += `?${params.toString()}`;

        return this.call(url, { requiresAuth: false });
    },

    async createExercise(data: Partial<Exercise>): Promise<{ success: boolean; data: Exercise }> {
        return this.call('/admin/exercises', {
            method: 'POST',
            body: data,
            requiresAuth: true
        });
    },

    async updateExercise(id: string, data: Partial<Exercise>): Promise<{ success: boolean; data: Exercise }> {
        return this.call(`/admin/exercises/${id}`, {
            method: 'PUT',
            body: data,
            requiresAuth: true
        });
    },

    async deleteExercise(id: string): Promise<{ success: boolean }> {
        return this.call(`/admin/exercises/${id}`, {
            method: 'DELETE',
            requiresAuth: true
        });
    },

    // Foods
    async getFoods(category?: string): Promise<{ success: boolean; data: Food[]; count?: number }> {
        let url = '/foods';
        if (category) url += `?category=${category}`;
        return this.call(url, { requiresAuth: false });
    },

    async createFood(data: Partial<Food>): Promise<{ success: boolean; data: Food }> {
        return this.call('/admin/foods', {
            method: 'POST',
            body: data,
            requiresAuth: true
        });
    },

    async updateFood(id: string, data: Partial<Food>): Promise<{ success: boolean; data: Food }> {
        return this.call(`/admin/foods/${id}`, {
            method: 'PUT',
            body: data,
            requiresAuth: true
        });
    },

    async deleteFood(id: string): Promise<{ success: boolean }> {
        return this.call(`/admin/foods/${id}`, {
            method: 'DELETE',
            requiresAuth: true
        });
    },

    // Auth (for admin login)
    async adminLogin(email: string, password: string) {
        // Hardcoded admin credentials
        const ADMIN_EMAIL = 'ss8971132@gmail.com';
        const ADMIN_PASSWORD = '##hellosarvasva69';

        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            return { success: true, token: 'admin_token_caroliv' };
        }

        throw new Error('Invalid email or password');
    },

    // App Config
    async getAppConfig(): Promise<{ success: boolean; data: any }> {
        return this.call('/admin/config', { requiresAuth: true });
    },

    async updateAppConfig(data: {
        requiredVersion: string;
        forceUpdate: boolean;
        updateMessage: string;
        updateUrl: string;
    }): Promise<{ success: boolean; data: any }> {
        return this.call('/admin/config', {
            method: 'PUT',
            body: data,
            requiresAuth: true
        });
    },

    // User Password Reset
    async resetUserPassword(userId: string, newPassword: string): Promise<{ success: boolean; message?: string }> {
        return this.call(`/admin/users/${userId}/password`, {
            method: 'PUT',
            body: { password: newPassword },
            requiresAuth: true
        });
    },

    // Food Submissions
    async getFoodSubmissions() {
        return this.call('/admin/food-submissions', { requiresAuth: true });
    },

    async approveFoodSubmission(id: string) {
        return this.call(`/admin/food-submissions/${id}/approve`, {
            method: 'POST',
            requiresAuth: true
        });
    },

    async rejectFoodSubmission(id: string) {
        return this.call(`/admin/food-submissions/${id}`, {
            method: 'DELETE',
            requiresAuth: true
        });
    },

    // Exercise Submissions
    async getExerciseSubmissions() {
        return this.call('/admin/exercise-submissions', { requiresAuth: true });
    },

    async approveExerciseSubmission(id: string) {
        return this.call(`/admin/exercise-submissions/${id}/approve`, {
            method: 'POST',
            requiresAuth: true
        });
    },

    async rejectExerciseSubmission(id: string) {
        return this.call(`/admin/exercise-submissions/${id}`, {
            method: 'DELETE',
            requiresAuth: true
        });
    },

    // Promotions (Ads)
    async getPromotions(): Promise<{ success: boolean; data: Promotion[] }> {
        return this.call('/promotion', { requiresAuth: false });
    },

    async updatePromotion(id: string, data: Partial<Promotion>) {
        return this.call(`/admin/promotions/${id}`, {
            method: 'PUT',
            body: data,
            requiresAuth: true
        });
    },

    async createPromotion(data: Partial<Promotion>) {
        return this.call('/admin/promotions', {
            method: 'POST',
            body: data,
            requiresAuth: true
        });
    },
};
