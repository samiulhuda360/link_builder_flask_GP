# # routes.py
# from flask import Flask, render_template, request, redirect, url_for
# import openpyxl
# from services import process_image, create_post_content, post_article

# app = Flask(__name__)

# @app.route('/process_sheet', methods=['POST'])
# def process_sheet():
#     # Load the workbook and select the active sheet
#     wb = openpyxl.load_workbook('samidur_sheet.xlsx')
#     sheet = wb.active

#     for row in sheet.iter_rows(values_only=True):
#         anchor = row[1]
#         t_url = row[2]
#         target_url = "https://" + row[2] + "/wp-json/wp/v2"
#         ...
#         # your code processing each row here...

#         download_image(anchor)
#         cropped_image = process_image(anchor)
#         image_data = upload_image(target_url, headers, cropped_image_path)
#         content = create_post_content(anchor, linking_url, image_data, ...)
#         post_article(target_url, headers, post_data)

#     return "Sheet Processed!"
