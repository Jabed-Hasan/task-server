"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Media = exports.MimeType = exports.MediaType = void 0;
const typeorm_1 = require("typeorm");
const Specialist_entity_1 = require("./Specialist.entity");
var MediaType;
(function (MediaType) {
    MediaType["IMAGE"] = "image";
    MediaType["VIDEO"] = "video";
    MediaType["DOCUMENT"] = "document";
})(MediaType || (exports.MediaType = MediaType = {}));
var MimeType;
(function (MimeType) {
    MimeType["JPG"] = "image/jpeg";
    MimeType["PNG"] = "image/png";
    MimeType["GIF"] = "image/gif";
    MimeType["MP4"] = "video/mp4";
    MimeType["PDF"] = "application/pdf";
})(MimeType || (exports.MimeType = MimeType = {}));
let Media = class Media {
};
exports.Media = Media;
__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid'),
    (0, typeorm_1.Generated)('uuid'),
    __metadata("design:type", String)
], Media.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    (0, typeorm_1.Generated)('uuid'),
    __metadata("design:type", String)
], Media.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { name: 'specialist_id' }),
    __metadata("design:type", String)
], Media.prototype, "specialist_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Media.prototype, "file_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], Media.prototype, "file_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Media.prototype, "cloudinary_public_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Media.prototype, "file_size", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Media.prototype, "display_order", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MimeType,
    }),
    __metadata("design:type", String)
], Media.prototype, "mime_type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MediaType,
    }),
    __metadata("design:type", String)
], Media.prototype, "media_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Media.prototype, "uploaded_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Media.prototype, "deleted_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Media.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Media.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Specialist_entity_1.Specialist, (specialist) => specialist.media, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'specialist_id' }),
    __metadata("design:type", Specialist_entity_1.Specialist)
], Media.prototype, "specialist", void 0);
exports.Media = Media = __decorate([
    (0, typeorm_1.Entity)('media')
], Media);
//# sourceMappingURL=Media.entity.js.map