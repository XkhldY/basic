# Route53 DNS for hirewithpom.com

resource "aws_route53_zone" "primary" {
  count = var.create_route53_zone ? 1 : 0

  name = var.domain_name

  tags = {
    Name        = "${var.project_name}-dns"
    Environment = var.environment
    Domain      = var.domain_name
  }
}

resource "aws_route53_record" "apex_a" {
  count = var.create_route53_zone ? 1 : 0

  zone_id = aws_route53_zone.primary[0].zone_id
  name    = var.domain_name
  type    = "A"
  ttl     = 300
  records = [aws_eip.app_server.public_ip]
}

resource "aws_route53_record" "www_cname" {
  count = var.create_route53_zone ? 1 : 0

  zone_id = aws_route53_zone.primary[0].zone_id
  name    = "www.${var.domain_name}"
  type    = "CNAME"
  ttl     = 300
  records = [var.domain_name]
}

resource "aws_route53_record" "api_a" {
  count = var.create_route53_zone ? 1 : 0

  zone_id = aws_route53_zone.primary[0].zone_id
  name    = "api.${var.domain_name}"
  type    = "A"
  ttl     = 300
  records = [aws_eip.app_server.public_ip]
}
