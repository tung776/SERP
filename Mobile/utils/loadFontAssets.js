import { Asset } from './enhancedAsset';
import { fontUrl } from '../../env';

export default async () => {
    const fontAsset = new Asset({
      name: 'vuarial',
      type: 'ttf',
      // path to the file somewhere on the internet
      uri: fontUrl,
    });


    try {
      //As the file is remote, we can't calculate its hash beforehand
      //so we download it without hash
      //downloadAsyncWithoutHash in enhancedAsset.js
      /**
       * @type {Boolean} cache
       *                    true: downloads asset to app cache
       *                    false: downloads asset to app data
       */
      await fontAsset.downloadAsyncWithoutHash({ cache: true });
      // console.log(fontAsset);

    } catch (e) {
      console.warn(
        'Không tải được font chữ, các văn bản hoặc tài liệu in ra có thể bị lỗi font chữ'
      );
      console.log(e.message);
    }
    finally {
      return fontAsset;
    }
  }