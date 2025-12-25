import { Component, OnInit } from '@angular/core';
import { Product } from '../../../services/product';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.html',
  styleUrls: ['./add.css'],
  imports: [FormsModule, CommonModule],
})
export class Add implements OnInit {
  // 🔥 EDIT MODE VARIABLES
  id: string | null = null;
  isEditMode = false;
  existingImages: string[] = [];

  // EXISTING FIELDS
  name = '';
  description = '';
  price: number | null = null;
  category = '';
  subCategory = '';
  subSubCategory = '';
  brand = '';
  countInStock: number | null = null;
  images: File[] = [];
  imagePreviews: string[] = [];
  message = '';
  loading = false;
  features: { [key: string]: string } = {};
  featureKey = '';
  featureValue = '';

  constructor(
    private Product: Product,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.checkForEditData();
  }

  // 🔥 CHECK FOR EDIT DATA
  private checkForEditData(): void {
    console.log('Checking for edit data...');

    // Using Location to get state data
    const currentState = (this.location.getState() as any);
    console.log('Complete State Data:', currentState);

    if (currentState && currentState.product) {
      console.log('✅ Edit data found:', currentState.product);
      this.populateFormData(currentState.product);
    } else {
      console.log('❌ No edit data found - Create Mode');
      this.message = 'Create new product';
    }
  }

  // 🔥 POPULATE FORM WITH EXISTING DATA (YOUR SPECIFIC DATA STRUCTURE)
  private populateFormData(product: any): void {
    this.isEditMode = true;
    this.id = product._id;

    // Basic Information
    this.name = product.name || '';
    this.description = product.description || '';
    this.price = product.price || null;

    // Categories (aapke data ke according)
    this.category = product.category || '';
    this.subCategory = product.subCategory || '';
    this.subSubCategory = product.subSubCategory || '';

    // Brand & Stock
    this.brand = product.brand || '';
    this.countInStock = product.countInStock || null;

    // Features (aapke features object ke according)
    this.features = { ...(product.features || {}) };

    // Existing Images (full URL banayein)
    this.existingImages = product.images ? 
      product.images.map((img: string) => 
        img.startsWith('http') ? img : `https://angular-server-mxyp.onrender.com${img}`
      ) : [];

    this.message = '✅ Edit mode activated. Updating existing product.';
    
    console.log('Form populated with data:', {
      name: this.name,
      description: this.description,
      price: this.price,
      category: this.category,
      subCategory: this.subCategory,
      subSubCategory: this.subSubCategory,
      brand: this.brand,
      countInStock: this.countInStock,
      features: this.features,
      images: this.existingImages
    });
  }

  // 🔥 GET ALL IMAGES FOR DISPLAY
  get allImages(): string[] {
    return [...this.existingImages, ...this.imagePreviews];
  }

  // 🔥 REMOVE EXISTING IMAGE
  removeExistingImage(index: number): void {
    this.existingImages.splice(index, 1);
    this.message = 'ℹ️ Image will be removed on update.';
  }

  // 🔥 REMOVE NEW IMAGE PREVIEW
  removeNewImage(index: number): void {
    this.imagePreviews.splice(index, 1);
    this.images.splice(index, 1);
  }

  get featuresList(): { key: string; value: string }[] {
    return Object.keys(this.features).map((key) => ({
      key,
      value: this.features[key],
    }));
  }

  onFileChange(event: any) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    this.images = Array.from(files);
    this.imagePreviews = [];

    this.images.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  // 🔥 ADD FEATURE KEY/VALUE
  addFeature() {
    if (this.featureKey.trim() && this.featureValue.trim()) {
      this.features[this.featureKey.trim()] = this.featureValue.trim();
      this.featureKey = '';
      this.featureValue = '';
      this.message = '';
    } else {
      this.message = '⚠️ Feature key aur value required hain!';
    }
  }

  // 🔥 REMOVE FEATURE
  removeFeature(key: string) {
    delete this.features[key];
  }

  // 🔥 UPDATED SUBMIT FORM (HANDLES BOTH CREATE AND UPDATE)
  submitForm() {
    if (!this.name || !this.price) {
      this.message = '⚠️ Name aur Price required hain!';
      return;
    }

    const formData = new FormData();

    // Basic Fields
    formData.append('name', this.name);
    formData.append('description', this.description);
    formData.append('price', String(this.price));

    // Category System
    formData.append('category', this.category);
    formData.append('subCategory', this.subCategory);
    formData.append('subSubCategory', this.subSubCategory);

    formData.append('brand', this.brand);
    formData.append('countInStock', String(this.countInStock || 0));

    // Features (JSON)
    if (Object.keys(this.features).length > 0) {
      formData.append('features', JSON.stringify(this.features));
    }

    // Multiple Images (only new ones for edit mode)
    this.images.forEach((file) => {
      formData.append('images', file);
    });

    this.loading = true;

    if (this.isEditMode && this.id) {
      // 🔥 UPDATE EXISTING PRODUCT
      this.Product.updateProduct(this.id, formData).subscribe({
        next: (res) => {
          this.message = '✅ Product updated successfully!';
          this.loading = false;
          this.resetForm();
        },
        error: (err) => {
          console.error('Update Error:', err);
          this.message = '❌ Product update failed!';
          this.loading = false;
        },
      });
    } else {
      // 🔥 CREATE NEW PRODUCT
      this.Product.createProduct(formData).subscribe({
        next: (res) => {
          this.message = '✅ Product created successfully!';
          this.loading = false;
          this.resetForm();
        },
        error: (err) => {
          console.error('Create Error:', err);
          this.message = '❌ Product create failed!';
          this.loading = false;
        },
      });
    }
  }

  // 🔥 RESET FORM AFTER SUBMIT
  private resetForm(): void {
      this.name = '';
      this.description = '';
      this.price = null;
      this.category = '';
      this.subCategory = '';
      this.subSubCategory = '';
      this.brand = '';
      this.countInStock = null;
      this.images = [];
      this.imagePreviews = [];
      this.features = {};
      this.existingImages = [];
  }

  // 🔥 CANCEL EDIT MODE
  cancelEdit(): void {
    this.isEditMode = false;
    this.id = null;
    this.existingImages = [];
    this.message = 'Edit mode cancelled.';
    this.resetForm();
  }

  // 🔥 DEBUG METHOD - Current form data dekhne ke liye
  debugFormData(): void {
    console.log('Current Form Data:', {
      isEditMode: this.isEditMode,
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      category: this.category,
      subCategory: this.subCategory,
      subSubCategory: this.subSubCategory,
      brand: this.brand,
      countInStock: this.countInStock,
      features: this.features,
      existingImages: this.existingImages,
      newImages: this.images.length
    });
  }
}