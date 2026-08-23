from flask import Blueprint, request, jsonify

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json(force=True)
    return jsonify({'status': 'ok', 'user': data.get('username')}), 200
