interface NSFWPrediction {
  className: string;
  probability: number;
}

interface ModerationResult {
  isNSFW: boolean;
  confidence: number;
  predictions: NSFWPrediction[];
  flaggedCategories: string[];
}

class ContentModerationService {
  private model: any = null;
  private isLoading = false;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized || this.isLoading) return;
    
    this.isLoading = true;
    
    try {
      // Dynamic import to avoid SSR issues
      const [nsfwjs, tf] = await Promise.all([
        import('nsfwjs'),
        import('@tensorflow/tfjs')
      ]);
      
      // Set TensorFlow.js backend
      await tf.ready();
      
      // Load the NSFW model
      this.model = await nsfwjs.load();
      this.isInitialized = true;
      
      console.log('NSFW model loaded successfully');
    } catch (error) {
      console.error('Failed to load NSFW model:', error);
      // Fallback to basic content analysis
      this.isInitialized = false;
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  async moderateCanvas(canvas: HTMLCanvasElement): Promise<ModerationResult> {
    if (!this.isInitialized || !this.model) {
      // Fallback to basic analysis
      return this.basicContentAnalysis(canvas);
    }

    try {
      const predictions = await this.model.classify(canvas);
      
      // Define thresholds for different categories
      const thresholds = {
        Porn: 0.3,
        Sexy: 0.5,
        Hentai: 0.3,
        // More lenient for drawings
        Drawing: 0.7,
        Neutral: 0.8
      };

      const flaggedCategories: string[] = [];
      let maxNSFWConfidence = 0;

      predictions.forEach((prediction: any) => {
        const threshold = thresholds[prediction.className as keyof typeof thresholds] || 0.5;
        
        if (['Porn', 'Sexy', 'Hentai'].includes(prediction.className)) {
          if (prediction.probability > threshold) {
            flaggedCategories.push(prediction.className);
            maxNSFWConfidence = Math.max(maxNSFWConfidence, prediction.probability);
          }
        }
      });

      // Additional check for drawing-specific content
      const isDrawingNSFW = this.analyzeDrawingContent(predictions);
      
      return {
        isNSFW: flaggedCategories.length > 0 || isDrawingNSFW,
        confidence: maxNSFWConfidence,
        predictions: predictions.map((p: any) => ({
          className: p.className,
          probability: p.probability
        })),
        flaggedCategories
      };
    } catch (error) {
      console.error('Error during content moderation:', error);
      return this.basicContentAnalysis(canvas);
    }
  }

  private basicContentAnalysis(canvas: HTMLCanvasElement): ModerationResult {
    // Basic fallback analysis based on drawing characteristics
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return {
        isNSFW: false,
        confidence: 0,
        predictions: [],
        flaggedCategories: []
      };
    }

    // Get image data for basic analysis
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Basic heuristics for inappropriate content
    let skinTonePixels = 0;
    let totalPixels = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      
      if (a > 0) { // Non-transparent pixel
        totalPixels++;
        
        // Simple skin tone detection
        if (this.isSkinTone(r, g, b)) {
          skinTonePixels++;
        }
      }
    }
    
    const skinToneRatio = totalPixels > 0 ? skinTonePixels / totalPixels : 0;
    const suspiciousContent = skinToneRatio > 0.3; // More than 30% skin tone might be suspicious
    
    return {
      isNSFW: suspiciousContent,
      confidence: suspiciousContent ? 0.6 : 0.1,
      predictions: [
        { className: 'Neutral', probability: suspiciousContent ? 0.4 : 0.9 },
        { className: 'Sexy', probability: suspiciousContent ? 0.6 : 0.1 }
      ],
      flaggedCategories: suspiciousContent ? ['Suspicious Content'] : []
    };
  }

  private isSkinTone(r: number, g: number, b: number): boolean {
    // Simple skin tone detection
    return (
      r > 95 && g > 40 && b > 20 &&
      r > g && r > b &&
      r - g > 15 && r - b > 15
    ) || (
      r > 220 && g > 210 && b > 170 &&
      Math.abs(r - g) <= 15 && r >= g && g >= b
    );
  }

  private analyzeDrawingContent(predictions: any[]): boolean {
    // More sophisticated analysis for drawing content
    const pornProb = predictions.find(p => p.className === 'Porn')?.probability || 0;
    const sexyProb = predictions.find(p => p.className === 'Sexy')?.probability || 0;
    const hentaiProb = predictions.find(p => p.className === 'Hentai')?.probability || 0;
    
    // Lower thresholds for drawings since they might be more abstract
    const combinedNSFWScore = (pornProb * 0.8) + (sexyProb * 0.3) + (hentaiProb * 0.6);
    
    return combinedNSFWScore > 0.4;
  }

  isModelReady(): boolean {
    return this.isInitialized && this.model !== null;
  }
}

export const contentModerationService = new ContentModerationService();
export type { ModerationResult, NSFWPrediction };
