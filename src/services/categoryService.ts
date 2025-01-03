import { CategoryModel } from "../models/category";
import { PostModel } from "../models/post";
import { PostCategoryModel } from "../models/postCategory";
import AppEventEmitter from "./eventEmitter";

class CategoryService {
    private static instance: CategoryService;
    private eventEmitter: AppEventEmitter;

    private constructor() {
        this.eventEmitter = AppEventEmitter.getInstance();
        this.initializeEventListeners();
    }

    public static getInstance(): CategoryService {
        if (!this.instance) { 
            this.instance = new CategoryService();
        }

        return this.instance;
    }

    private initializeEventListeners() {
        this.eventEmitter.on("post:categories:analyzed", this.handlePostCategoriesAnalyzed.bind(this));
    }

    private async handlePostCategoriesAnalyzed(data: {
        postId: string,
        userId: string,
        categories: {
            id: number,
            categories: string[]
        }[]
    }) {
        // check categories if exist. If dont create categories and push an array its id.
        const categoryNames = [...new Set(data.categories.flatMap(category => category.categories))];
        
        // Assuming CategoryModel has a method to find categories by name
        const existingCategories = await CategoryModel.find({ name: { $in: categoryNames } });
        const existingCategoryNames = existingCategories.map(category => category.name);

        const newCategoryNames = categoryNames.filter(name => !existingCategoryNames.includes(name));

        // Create new categories for names that don't exist
        const newCategories = await Promise.all(newCategoryNames.map(name => CategoryModel.create({ name })));

        // Combine existing and new categories
        const allCategories = [...existingCategories, ...newCategories];

        // find the post
        const post = await PostModel.findById(data.postId);

        if (!post) {
            console.error("Post not found! Post ID: ", data.postId);
            return ;
        }

        // Önce bu post için var olan tüm kategori ilişkilerini sil
        await PostCategoryModel.deleteMany({ postId: data.postId });

        // Yeni kategori ilişkilerini oluştur
        const postCategoryRecords = allCategories.map(category => ({
            postId: data.postId,
            categoryId: category._id
        }));

        // Toplu olarak kayıt oluştur
        await PostCategoryModel.insertMany(postCategoryRecords);

        // Kategori sayılarını güncelle
        await Promise.all(allCategories.map(category => 
            CategoryModel.updateOne(
                { _id: category._id },
                { $inc: { numberOfPost: 1 } }
            )
        ));
    }
}

export default CategoryService;