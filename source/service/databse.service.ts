import { CONFIG } from '@/config';
import { Collection, MongoClient } from 'mongodb';

export interface Image {
    name: string;
    timestamp: Date;
    path: string;
    sizeInBytes: number;
    sizeHumanReadable: string;
}

export class DatabaseService {
    private async getConnection(): Promise<MongoClient> {
        return await MongoClient.connect(CONFIG.MONGODB.URI);
    }

    private async getCollection(album: string): Promise<Collection<Image>> {
        const connection = await this.getConnection();
        const db = connection.db(CONFIG.MONGODB.DATABASE);
        return db.collection(album);
    }

    public async tryConnection(): Promise<void> {
        await this.getConnection();
    }

    public async getLastAlbumTimestamp(album: string): Promise<Date | null> {
        const collection = await this.getCollection(album);
        const lastAlbum = await collection.findOne({}, { sort: { timestamp: -1 } });
        return lastAlbum ? lastAlbum.timestamp : null;
    }

    public async insertImage(album: string, image: Image): Promise<void> {
        const collection = await this.getCollection(album);
        await collection.insertOne(image);
    }
}

export default new DatabaseService();
