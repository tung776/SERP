import { Asset } from './enhancedAsset';
import { URL } from '../../env';

export default async (name, type, url) => {
    const mediaAsset = new Asset({
      name: name,
      type: type,
      // path to the file somewhere on the internet
      uri: url,
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
      await mediaAsset.downloadAsyncWithoutHash({ cache: true });
      // console.log(mediaAsset);

    } catch (e) {
      console.warn(
        'Không tải được hình ảnh'
      );
      console.log(e.message);
    }
    finally {
      return mediaAsset;
    }
  }